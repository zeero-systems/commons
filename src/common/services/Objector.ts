import type { EntryType, FunctionType, MappedPropertiesType, OmitType } from '~/common/types.ts';
import type { ValidationResultType } from '~/validator/types.ts';
import type { DecorationMetadataMapType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/Decorator.ts';
import Metadata from '~/common/services/Metadata.ts';
import Validator from '~/validator/services/Validator.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import isDate from '~/common/guards/isDate.ts';
import isValidation from '~/validator/guards/isValidation.ts';

/**
 * Common operations to a object
 *
 * @member {Array<EntryType<T>>} getEntries - Returns a entries from properties
 * @member {OmitType<T, K>} deleteProperties - Deletes and return an object without the deleted properties
 */
export class Objector {
  public static getKeys<T extends Record<PropertyKey, any>>(target: T): Array<string | symbol> {
    return Object.keys(target);
  }

  public static getEntries<T extends Record<PropertyKey, any>>(target: T): ReadonlyArray<EntryType<T>> {
    return Object.entries(target) as unknown as ReadonlyArray<EntryType<T>>;
  }

  public static deleteProperties<T extends Record<PropertyKey, any>>(
    target: T,
    properties: Array<string | symbol>,
  ): OmitType<T, keyof typeof properties> {
    return Objector.getEntries(target).reduce((previous: any, [key, value]: any) => {
      if (!properties.includes(key)) previous[key] = value;
      return previous;
    }, {}) as OmitType<T, keyof typeof properties>;
  }

  public static toEntries<T extends Record<PropertyKey, any>>(target: T): ReadonlyArray<EntryType<OmitType<T, FunctionType>>> {
    return Objector.getEntries<OmitType<T, FunctionType>>(target);
  }

  public static toPlain<T extends Record<PropertyKey, any>>(target: T): string {
    return Objector.toEntries(target).reduce((a, [key, value]) => {
      return a += `${String(key)}=${value}\n`;
    }, '').trim();
  }

  public static toJson<T extends Record<PropertyKey, any>>(target: T): OmitType<T, FunctionType> {
    return Objector.toEntries(target).reduce((a, [key, value]) => {
      return { ...a, [key]: value };
    }, {}) as T;
  }

  public static getPropertyKeys<T extends Record<PropertyKey, any>, K extends keyof OmitType<T, FunctionType>>(target: T): K[] {
    return Object.getOwnPropertyNames(target) as K[];
  }

  public static getPropertyType<T extends Record<PropertyKey, any>, K extends keyof OmitType<T, FunctionType>>(
    target: T,
    propertyKey: K,
  ): string {
    if (isDate(target[propertyKey])) {
      return `[object Date]`;
    }

    return `${typeof target[propertyKey]}`;
  }

  public static validateProperty<T extends Record<PropertyKey, any>, K extends keyof OmitType<T, FunctionType>>(
    target: T,
    propertyKey: K,
  ): Promise<ValidationResultType[]> {
    let validations: any[] = [];
    const metadata = Metadata.getByKey<DecorationMetadataMapType<any>>(target, Decorator.metadata);

    if (metadata) {
      validations = metadata.get(propertyKey)?.reduce((previous: any, current) => {
        if (isValidation(current.annotation)) {
          previous.push({
            validation: current.annotation,
            parameters: current.parameters,
          });
        }
        return previous;
      }, []);
    }

    return Validator.validateValue(target[propertyKey], validations);
  }

  public static validateProperties<T extends Record<PropertyKey, any>>(
    target: T,
    onlyResultWithKeys?: Array<ValidationEnum>,
  ): Promise<MappedPropertiesType<T, ValidationResultType[]> | undefined> {
    const promises = [];

    for (const key of Objector.getKeys(target)) {
      promises.push(
        Objector.validateProperty(target, key as any)
          .then((validations) => {
            if (onlyResultWithKeys) {
              validations = validations.filter((v) => onlyResultWithKeys!.includes(v.key));
            }

            return { key, validations };
          }),
      );
    }

    return Promise.all(promises).then((results) => {
      let targetValidations: { [key: string | symbol]: ValidationResultType[] } | undefined;
      for (const { key, validations } of results) {
        if (validations.length > 0) {
          if (!targetValidations) targetValidations = {};
          targetValidations[key] = validations;
        }
      }
      return targetValidations as MappedPropertiesType<T, ValidationResultType[]> | undefined;
    });
  }
}

export default Objector;
