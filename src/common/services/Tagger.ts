import type { ConstructorType, TagType } from '~/common/types.ts';
import type { DecorationType } from '~/decorator/types.ts';
import Metadata from '~/common/services/Metadata.ts';

/**
 * Simple class to hold tagger symbol
 */
export class Tagger {
  public static readonly metadata: unique symbol = Symbol('Tagger.metadata');

  public static applyDecoration<P>(decoration: DecorationType<P>): void {
    if (decoration.property) {
      if (!decoration.context.metadata[Tagger.metadata]) {
        decoration.context.metadata[Tagger.metadata] = [];
      }
    }
  }

  public static setDecorarion<P>(tag: TagType, decoration: DecorationType<P>): void {
    if (!decoration.context.metadata[Tagger.metadata].includes(tag)) {
      decoration.context.metadata[Tagger.metadata].push(tag)
    }
  }

  public static applyMetadata<T extends ConstructorType<any>>(target: T): T {
    if (!target[Symbol.metadata]) {
      target[Symbol.metadata] = {}
    }

    // @ts-ignore we just applied the metadata object ...
    target[Symbol.metadata][Tagger.metadata] = []

    return target
  }

  public static setMetadata<T extends ConstructorType<any>>(tag: TagType, target: T): void {
    if (target[Symbol.metadata]) {
      // @ts-ignore we already confirmed the apply metadata
      if (!target[Symbol.metadata][Tagger.metadata].includes(tag)) {
        // @ts-ignore same thing
        target[Symbol.metadata][Tagger.metadata].push(tag)
      }
    }
  }

  public static getMetadata(target: any): Array<TagType> {
    let tags = []
    
    if (target[Symbol.metadata]) {
      tags = target[Symbol.metadata][Tagger.metadata]
    }

    return tags
  }
}

export default Tagger;
