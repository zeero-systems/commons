import type { DecorationType, MetadataType, DecoratorPropertyType, MetadataDecoratorType } from '~/decorator/types.ts';

import ArrayMap from '~/structure/services/ArrayMap.ts';
import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';
import MetadataTagEnum from '~/common/enums/MetadataTagEnum.ts';

export class Metadata {

  static addDecorator<T, P>(
    context: T & { metadata: MetadataType<T, P> },
    property: string | symbol,
    decoration: DecorationType<P>,
  ): void {
    if (!context.metadata.decorators) {
      context.metadata.decorators = new Map<DecoratorPropertyType, ArrayMap<DecoratorGroupEnum, DecorationType<P>>>();
    }
    if (!context.metadata.decorators.has(property)) {
      context.metadata.decorators.set(property, new ArrayMap<DecoratorGroupEnum, DecorationType<P>>());
    }
    context.metadata.decorators.get(property)?.add(decoration.target.group, decoration);
  }

  static getDecorator<T, P>(target: T): MetadataDecoratorType<P> | undefined {
    return Metadata.getMetadata<T, P>(target).decorators
  }

  static applyMetadata<T, P>(target: any): MetadataType<T, P> {
    if (!target[Symbol.metadata]) target[Symbol.metadata] = {}
    return target[Symbol.metadata]
  } 

  static hasMetadata<T, P>(target: any): target is any & MetadataType<T, P> {
    return !!target[Symbol.metadata] || !!target.constructor[Symbol.metadata];
  }

  static getMetadata<T, P>(target: any): MetadataType<T, P> {
    return target[Symbol.metadata] || target.constructor[Symbol.metadata];
  }

  static applyTag<T, P>(context: T & { metadata: MetadataType<T, P> }, tagName: MetadataTagEnum): MetadataTagEnum {
    if (!context.metadata.tags) {
      context.metadata.tags = [];
    }
    if (!context.metadata.tags.includes(tagName)) {
      context.metadata.tags.push(tagName);
    }

    return tagName
  }

  static hasTag<T, P>(context: T & { metadata: MetadataType<T, P> }, tagName: MetadataTagEnum): boolean {
    return !!context.metadata.tags && context.metadata.tags.includes(tagName);
  }

  static getTags<T, P>(target: T): MetadataTagEnum[] | undefined {
    return Metadata.getMetadata<T, P>(target).tags
  }
}

export default Metadata;
