// deno-lint-ignore-file ban-types
import type { EntryType, OmitType } from '~/common/types.ts';
import type { EntityInterface } from '~/entity/interfaces.ts';
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

    return Validator.validateValue(this[propertyKey], validations);
  }

  public validateProperties(): { [key in keyof OmitType<this, Function>]: ValidationResultType[] } {
    return this.toEntries().reduce((a, [key, _value]) => {
      return { ...a, [key]: this.validateProperty(key as any) };
    }, {}) as { [key in keyof OmitType<this, Function>]: ValidationResultType[] };
  }
}

export default Entity;
