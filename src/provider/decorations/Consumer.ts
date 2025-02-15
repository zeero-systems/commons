import type { DecorationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorType } from '~/decorator/types.ts';
import type { ConsumerParameterType } from '~/provider/types.ts';

import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import DecoratorException from '~/decorator/exceptions/DecoratorException.ts';

import applyConsumerProxyFn from '~/provider/functions/applyConsumerProxyFn.ts';
import applyConsumerAccessorFn from '~/provider/functions/applyConsumerAcessorFn.ts';
import applyDecorationFn from '~/decorator/functions/applyDecorationFn.ts';

export class Consumer implements DecorationInterface {
  group: DecoratorGroupEnum = DecoratorGroupEnum.CONSUMERS;

  onAttach<T, P>(decorator: DecoratorType<T, P>, decoration?: DecorationType<P & ConsumerParameterType>): any {
    if (decorator.context.kind == DecoratorKindEnum.CLASS) {
      return applyConsumerProxyFn(decorator, decoration)[0].target;
    }

    if (decorator.context.kind == DecoratorKindEnum.ACCESSOR) {
      return applyConsumerAccessorFn(decorator, decoration);
    }

    throw new DecoratorException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: decorator.targetName, kind: decorator.context.kind },
    });
  }
}

export default (parameters?: ConsumerParameterType) => applyDecorationFn(Consumer, parameters);
