import type { DecorationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorType } from '~/decorator/types.ts';

import DecoratorException from '~/decorator/exceptions/DecoratorException.ts';
import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';

import applyDecorationFn from '~/decorator/functions/applyDecorationFn.ts';
import applySingletonProxyFn from '~/common/functions/applySingletonProxyFn.ts';

export class Singleton implements DecorationInterface {
  group = DecoratorGroupEnum.COMMONS;

  onAttach<T, P>(decorator: DecoratorType<T, P>, decoration?: DecorationType<P>): any {
    if (decorator.context.kind == DecoratorKindEnum.CLASS) {
      return applySingletonProxyFn(decorator, decoration)[0].target
    }

    throw new DecoratorException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: decorator.targetName, kind: decorator.context.kind },
    });
  }
}

export default () => applyDecorationFn(Singleton);
