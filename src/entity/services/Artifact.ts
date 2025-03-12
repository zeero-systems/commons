// deno-lint-ignore-file ban-types
import type { EntryType, OmitType } from '~/common/types.ts';
import type { MappedEntityPropertyType } from '~/entity/types.ts';
import type { ValidationResultType } from '~/validator/types.ts';

import Decorator from '~/decorator/services/Decorator.ts';
import Metadata from '~/common/services/Metadata.ts';
import Validator from '~/validator/services/Validator.ts';

import isDate from '~/common/guards/isDate.ts';
import isDecoratorMetadata from '~/decorator/guards/isDecoratorMetadata.ts';
import isValidation from '~/validator/guards/isValidation.ts';
import Objector from '~/common/services/Objector.ts';
import { ValidationEnum } from '-/mod.ts';

export class Artifact {
  public static toEntries<T extends {}>(target: T): ReadonlyArray<EntryType<OmitType<T, Function>>> {
    return Objector.getEntries<OmitType<T, Function>>(target);
  }

  public static toPlain<T extends {}>(target: T): string {
    return Artifact.toEntries(target).reduce((a, [key, value]) => {
      return a += `${String(key)}=${value}\n`;
    }, '').trim();
  }

  public static toJson<T extends {}>(target: T): OmitType<T, Function> {
    return Artifact.toEntries(target).reduce((a, [key, value]) => {
      return { ...a, [key]: value };
    }, {}) as T;
  }

  public static getPropertyKeys<T extends {}, K extends keyof OmitType<T, Function>>(target: T): K[] {
    return Object.getOwnPropertyNames(target) as K[];
  }

  public static getPropertyType<T extends {}, K extends keyof OmitType<T, Function>>(target: T, propertyKey: K): string {
    if (isDate(target[propertyKey])) {
      return `[object Date]`;
    }

    return `${typeof target[propertyKey]}`;
  }

  public static validateProperty<T extends {}, K extends keyof OmitType<T, Function>>(target: T, propertyKey: K): ValidationResultType[] {
      let validations: any[] = []
      const metadata = Metadata.getProperty(target, Decorator.metadata)
  
      if (isDecoratorMetadata(metadata)) {        
        validations = metadata.get(propertyKey)?.reduce((previous: any, current) => {
          if (isValidation(current.annotation)) {
            previous.push({
              validation: current.annotation,
              parameters: current.parameters
            })
          }
          return previous
        }, [])
      }
  
    return Validator.validateValue(target[propertyKey], validations)
  }

  public static validateProperties<T extends {}>(target: T, onlyResultWithKeys?: Array<ValidationEnum>): Promise<MappedEntityPropertyType<T, ValidationResultType[]> | undefined> {
    return new Promise((resolve) => {
      let targetValidations: { [key: string | symbol]: ValidationResultType[] } | undefined

      for (const [key, _value] of Artifact.toEntries(target)) {
        const validations = Artifact.validateProperty(target, key as any)
        const onlyValidations = onlyResultWithKeys ? validations.filter(v => onlyResultWithKeys.includes(v.key)) : validations
        
        if (onlyValidations.length > 0) {
          if (!targetValidations) targetValidations = {}
          targetValidations[key] = onlyValidations
        }
      }

      resolve(targetValidations)
    })
  }
}

export default Artifact;
