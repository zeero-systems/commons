import type { ConsumerObjectParameterType, ConsumerParameterType } from '~/provider/types.ts';
import type { DecorationType, DecoratorType } from '~/decorator/types.ts';

import Provider from '~/provider/services/Provider.ts';
import ProviderException from '~/provider/exceptions/ProviderException.ts';

import guardStringFn from '~/common/guards/guardStringFn.ts';
import guardClassFn from '~/common/guards/guardClassFn.ts';
import guardConsumerObjectParameterFn from '~/provider/guards/guardConsumerObjectParameterFn.ts';
import toFirstLetterToUppercaseFn from '~/common/functions/toFirstLetterUppercaseFn.ts';

export const applyConsumerAccessorFn = <T, P>(decorator: DecoratorType<T, P>, decoration?: DecorationType<P & ConsumerParameterType>) => {
  
  const context = decorator.context as any

  let decoratorProvider: ConsumerObjectParameterType = {};
  if (guardStringFn(decoration?.parameters)) {
    decoratorProvider[decoration.parameters] = { optional: true };
  }
  if (guardClassFn(decoration?.parameters)) {
    decoratorProvider[decoration.parameters.name] = { optional: true };
  }
  if (guardConsumerObjectParameterFn(decoration?.parameters)) {
    decoratorProvider = decoration.parameters;
  }

  return {
    set: function () {},
    get: function () {
      if (!context.name) return undefined;

      let providerName = context.name;
      if (guardStringFn(decoration?.parameters)) {
        providerName = decoration.parameters;
      }
      if (guardClassFn(decoration?.parameters)) {
        providerName = decoration.parameters.name;
      }

      providerName = toFirstLetterToUppercaseFn(providerName)

      if (
        !Provider.exists(providerName) &&
        decoratorProvider[providerName] &&
        !decoratorProvider[providerName].optional
      ) {
        throw new ProviderException('Provider {name} not found', {
          key: 'NOT_FOUND',
          context: { name: providerName },
        });
      }

      return Provider.construct(providerName);
    },
    thrownable: true,
    propertyDecorator: {
      enumerable: true,
      configurable: true,
    },
  };
};

export default applyConsumerAccessorFn;
