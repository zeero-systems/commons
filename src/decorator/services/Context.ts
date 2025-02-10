import type { DecorationType, DecoratorContextType, DecoratorPropertyType } from '~/decorator/types.ts';

import ArrayMap from '~/structure/services/ArrayMap.ts';
import ContextTagEnum from '~/decorator/enums/ContextTagEnum.ts';

export class Context {
  static addDecorator<T, P>(
    context: DecoratorContextType<T, P>,
    targetProperty: string | symbol,
    decoration: DecorationType<P>,
  ): void {
    if (!context.metadata.decorators) {
      context.metadata.decorators = new Map<DecoratorPropertyType, ArrayMap<ContextTagEnum, DecorationType<P>>>();
    }
    if (!context.metadata.decorators.has(targetProperty)) {
      context.metadata.decorators.set(targetProperty, new ArrayMap<ContextTagEnum, DecorationType<P>>());
    }
    Context.addTag(context, decoration.target.tag);
    context.metadata.decorators.get(targetProperty)?.add(decoration.target.tag, decoration);
  }

  static getDecorator<T, P>(target: any): Map<DecoratorPropertyType, ArrayMap<ContextTagEnum, DecorationType<P>>> {
    const metadata = target[Symbol.metadata] || target.constructor[Symbol.metadata];
    return metadata?.decorators;
  }

  static addTag<T, P>(context: DecoratorContextType<T, P>, tagName: string): void {
    if (!context.metadata.tags) {
      context.metadata.tags = [];
    }
    if (!context.metadata.tags.includes(tagName)) {
      context.metadata.tags.push(tagName);
    }
  }

  static hasTag<T, P>(context: DecoratorContextType<T, P>, tagName: string): boolean {
    return !!context.metadata.tags && context.metadata.tags.includes(tagName);
  }
}

export default Context;
