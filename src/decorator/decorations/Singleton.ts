import type { DecorationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorType } from '~/decorator/types.ts';

import ContextTagEnum from '~/decorator/enums/ContextTagEnum.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import DecoratorException from '~/decorator/exceptions/DecoratorException.ts';

import applyDecorationFn from '~/decorator/functions/applyDecorationFn.ts';
import applySingletonProxyFn from '~/decorator/functions/applySingletonProxyFn.ts';

export class Singleton implements DecorationInterface {
  tag = ContextTagEnum.SINGLETON;

  onAttach<T, P>(decorator: DecoratorType<T, P>, _decoration: DecorationType<P>) {
    if (decorator.context.kind == DecoratorKindEnum.CLASS) {
      return applySingletonProxyFn<T, P>(decorator);
    }

    throw new DecoratorException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: decorator.targetName, kind: decorator.context.kind },
    });
  }
}

export default () => applyDecorationFn(Singleton);
