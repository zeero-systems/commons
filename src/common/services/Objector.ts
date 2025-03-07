import { EntryType, OmitType } from '~/common/types.ts';

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
}

export default Objector;
