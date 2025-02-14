import type { DecorationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorType } from '~/decorator/types.ts';
import type { ProviderParameterType, ProviderType } from '~/provider/types.ts';

import DecoratorException from '~/decorator/exceptions/DecoratorException.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';

import applyDecorationFn from '~/decorator/functions/applyDecorationFn.ts';
import applyProviderProxyFn from '~/provider/functions/applyProviderProxyFn.ts';

export class Provider implements DecorationInterface {
  group: DecoratorGroupEnum = DecoratorGroupEnum.PROVIDERS;

  onAttach<T, P>(decorator: DecoratorType<T & ProviderType, P>, decoration?: DecorationType<P & ProviderParameterType>) {
    if (decorator.context.kind == DecoratorKindEnum.CLASS) {
      return applyProviderProxyFn(decorator, decoration)[0].target;
    }

    throw new DecoratorException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: decorator.targetName, kind: decorator.context.kind },
    });
  }
}

export default (parameters?: ProviderParameterType) => applyDecorationFn(Provider, parameters);
