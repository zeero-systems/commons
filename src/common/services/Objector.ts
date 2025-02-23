import { EntryType, OmitType } from '~/common/types.ts';

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
