import type { EntryType, FunctionType, OmitType } from '~/common/types.ts';

import isDate from '~/common/guards/is-date.guard.ts';

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
}

export default Objector;
