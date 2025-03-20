// deno-lint-ignore-file ban-types
import type { EntryType, OmitType } from '~/common/types.ts';
import type { ValidationResultType } from '~/validator/types.ts';
import type { MappedEntityPropertyType } from '~/entity/types.ts';

import Decorator from '~/decorator/services/Decorator.ts';
import Metadata from '~/common/services/Metadata.ts';
import Validator from '~/validator/services/Validator.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import isDate from '~/common/guards/isDate.ts';
import isDecoratorMetadata from '~/decorator/guards/isDecoratorMetadata.ts';
import isValidation from '~/validator/guards/isValidation.ts';

/**
 * Common operations to a object
 * 
 * @member {Array<EntryType<T>>} getEntries - Returns a entries from properties
 * @member {OmitType<T, K>} deleteProperties - Deletes and return an object without the deleted properties
 */ 
export class Objector {

  public static getEntries<T extends {}>(target: T): ReadonlyArray<EntryType<T>> {
    return Object.entries(target) as unknown as ReadonlyArray<EntryType<T>>;
  }

  public static deleteProperties<T extends {}>(target: T, properties: Array<string | symbol>): OmitType<T, keyof typeof properties> {
    return Objector.getEntries(target).reduce((previous: any, [key, value]: any) => {
      if (!properties.includes(key)) previous[key] = value
      return previous
    }, {}) as OmitType<T, keyof typeof properties>
  }

  public static toEntries<T extends {}>(target: T): ReadonlyArray<EntryType<OmitType<T, Function>>> {
    return Objector.getEntries<OmitType<T, Function>>(target);
  }

  public static toPlain<T extends {}>(target: T): string {
    return Objector.toEntries(target).reduce((a, [key, value]) => {
      return a += `${String(key)}=${value}\n`;
    }, '').trim();
  }

  public static toJson<T extends {}>(target: T): OmitType<T, Function> {
    return Objector.toEntries(target).reduce((a, [key, value]) => {
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

      for (const [key, _value] of Objector.toEntries(target)) {
        const validations = Objector.validateProperty(target, key as any)
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

export default Objector;
