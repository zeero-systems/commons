// deno-lint-ignore-file ban-types
import type { EntryType, OmitType } from '~/common/types.ts';
import type { EntityInterface } from '~/entity/interfaces.ts';
import type { MappedEntityPropertyType } from '~/entity/types.ts';
import type { ValidationResultType } from '~/validator/types.ts';

import Decorator from '~/decorator/services/Decorator.ts';
import Metadata from '~/common/services/Metadata.ts';
import Validator from '~/validator/services/Validator.ts';

import isDateFn from '~/common/guards/isDateFn.ts';
import isDecoratorMetadataFn from '~/decorator/guards/isDecoratorMetadataFn.ts';
import isValidationFn from '~/validator/guards/isValidationFn.ts';
import Objector from '~/common/services/Objector.ts';

export class Entity implements EntityInterface {
  public toEntries(): ReadonlyArray<EntryType<OmitType<this, Function>>> {
    return Objector.getEntries<OmitType<this, Function>>(this);
  }

  public toPlain(): string {
    return this.toEntries().reduce((a, [key, value]) => {
      return a += `${String(key)}=${value}\n`;
    }, '').trim();
  }

  public toJson(): OmitType<this, Function> {
    return this.toEntries().reduce((a, [key, value]) => {
      return { ...a, [key]: value };
    }, {}) as this;
  }

  public getPropertyKeys<K extends keyof OmitType<this, Function>>(): K[] {
    return Object.getOwnPropertyNames(this) as K[];
  }

  public getPropertyType<K extends keyof OmitType<this, Function>>(propertyKey: K): string {
    if (isDateFn(this[propertyKey])) {
      return `[object Date]`;
    }

    return `${typeof this[propertyKey]}`;
  }

  public validateProperty<K extends keyof OmitType<this, Function>>(propertyKey: K): ValidationResultType[] {
      let validations: any[] = []
      const metadata = Metadata.getProperty(this, Decorator.metadata)
  
      if (isDecoratorMetadataFn(metadata)) {        
        validations = metadata.get(propertyKey)?.reduce((previous: any, current) => {
          if (isValidationFn(current.annotation)) {
            previous.push({
              validation: current.annotation,
              parameters: current.parameters
            })
          }
          return previous
        }, [])
      }
  
    return Validator.validateValue(this[propertyKey], validations)
  }

  public validateProperties(): Promise<MappedEntityPropertyType<this, ValidationResultType[]>> {
    return new Promise((resolve) => {

      const promises: any = []
      
      for (const [key, _value] of this.toEntries()) {
        promises.push({ key, result: this.validateProperty(key as any)})        
      }

      Promise.all(promises).then((items) => {
        const validations: any = {}
        for (const { key, result } of items) {
          validations[key] = result
        }
        resolve(validations)
      })
    })
  }
}

export default Entity;
