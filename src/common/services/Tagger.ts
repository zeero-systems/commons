import type { TagType } from '~/common/types.ts';
import type { DecorationType } from '~/decorator/types.ts';
import Metadata from '~/common/services/Metadata.ts';

/**
 * Simple class to hold tagger symbol
 */
export class Tagger {
  public static readonly metadata: unique symbol = Symbol('Tagger.metadata');

  public static applyMetadata<P>(decoration: DecorationType<P>): void {
    if (decoration.property) {
      if (!decoration.context.metadata[Tagger.metadata]) {
        decoration.context.metadata[Tagger.metadata] = [];
      }
    }
  }

  public static set<P>(tag: TagType, decoration: DecorationType<P>): void {
    if (!decoration.context.metadata[Tagger.metadata].includes(tag)) {
      decoration.context.metadata[Tagger.metadata].push(tag)
    }
  }

  public static get(target: any): string[] {
    let tags = []
    const metadata = Metadata.get(target)
    if (metadata) {
      tags = metadata[Tagger.metadata]
    }

    return tags
  }
}

export default Tagger;
