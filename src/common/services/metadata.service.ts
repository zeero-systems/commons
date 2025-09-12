import type { KeyableType, MetadataType } from '~/common/types.ts';

import isObject from '~/common/guards/is-object.guard.ts';

/**
 * Common operations for metadata management
 * 
 * @class
 * @static
 * @member {MetadataType} set - Sets metadata symbol to a target
 * @member {void} add - Adds a key-value pair to target's metadata
 * @member {boolean} has - Checks if target has metadata
 * @member {MetadataType | undefined} get - Returns metadata content
 * @member {V | undefined} getByKey - Returns specific metadata value by key
 */
export class Metadata {
  public static set(target: any): void {    
    if (isObject(target)) {
      if (target.constructor) {
        if (!target.constructor[Symbol.metadata]) {
          target.constructor[Symbol.metadata] = {}
        }
      } else {
        if (!target[Symbol.metadata]) {
          target[Symbol.metadata] = {}
        }
      }      
    }
  }

  public static add<V>(target: any, key: KeyableType, value: V): void {
    if (!Metadata.has(target)) {
      Metadata.set(target);
    }
    
    const metadata = Metadata.get(target)

    if (metadata) {
      metadata[key] = value;
    }
  }

  public static has(target: any): boolean {
    return !!Metadata.get(target)
  }

  public static get(target: any): MetadataType<any> | undefined {
    return target[Symbol.metadata] || target.constructor[Symbol.metadata]
  }

  public static getByKey<V>(target: any, key: KeyableType): V | undefined {
    const metadata = Metadata.get(target)

    if (metadata) {
      return metadata[key] as V
    }

    return undefined
  }
}

export default Metadata