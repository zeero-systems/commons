import type { DecorationType, MetadataType, DecoratorPropertyType } from '~/decorator/types.ts';

import ArrayMap from '~/structure/services/ArrayMap.ts';
import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';
import MetadataTagEnum from '~/common/enums/MetadataTagEnum.ts';

export class Metadata {
  static addDecorator<T, P>(
    metadata: MetadataType<T, P>,
    targetProperty: string | symbol,
    decoration: DecorationType<P>,
  ): void {
    if (!metadata.decorators) {
      metadata.decorators = new Map<DecoratorPropertyType, ArrayMap<DecoratorGroupEnum, DecorationType<P>>>();
    }
    if (!metadata.decorators.has(targetProperty)) {
      metadata.decorators.set(targetProperty, new ArrayMap<DecoratorGroupEnum, DecorationType<P>>());
    }
    metadata.decorators.get(targetProperty)?.add(decoration.target.group, decoration);
  }

  static getDecorator<T, P>(target: any): Map<DecoratorPropertyType, ArrayMap<DecoratorGroupEnum, DecorationType<P>>> {
    const metadata = target[Symbol.metadata] || target.constructor[Symbol.metadata];
    return metadata?.decorators;
  }

  static addTag<T, P>(metadata: MetadataType<T, P>, tagName: MetadataTagEnum): void {
    if (!metadata.tags) {
      metadata.tags = [];
    }
    if (!metadata.tags.includes(tagName)) {
      metadata.tags.push(tagName);
    }
  }

  static hasTag<T, P>(metadata: MetadataType<T, P>, tagName: MetadataTagEnum): boolean {
    return !!metadata.tags && metadata.tags.includes(tagName);
  }
}

export default Metadata;
