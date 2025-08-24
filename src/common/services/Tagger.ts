import type { DecorationType } from '~/decorator/types.ts';
import type { TagType } from '~/common/types.ts';

export class Tagger {
  public static readonly metadata: unique symbol = Symbol('Tagger.metadata');

  public static applyDecoration<P>(decoration: DecorationType<P>): void {
    const tag = decoration.annotation.constructor.prototype.tag

    if (decoration.property && tag) {
      if (!decoration.context.metadata[Tagger.metadata]) {
        decoration.context.metadata[Tagger.metadata] = [];
      }

      if (!decoration.context.metadata[Tagger.metadata].includes(tag)) {
        decoration.context.metadata[Tagger.metadata].push(tag)
      }
    }
  }

  public static getMetadata(target: any): Array<TagType> {
    let tags = [];
    
    if (target[Symbol.metadata]) {
      tags = target[Symbol.metadata][Tagger.metadata]
    }

    return tags;
  }
}

export default Tagger;
