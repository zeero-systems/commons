import type { ConsumerObjectParameterType, ConsumerParameterType } from '~/provider/types.ts';
import type { DecorationType, DecoratorType } from '~/decorator/types.ts';

import Provider from '~/provider/services/Provider.ts';
import ProviderException from '~/provider/exceptions/ProviderException.ts';

import isStringFn from '~/common/guards/isStringFn.ts';
import isClassFn from '~/common/guards/isClassFn.ts';
import isConsumerObjectParameterFn from '~/provider/guards/isConsumerObjectParameterFn.ts';
import toFirstLetterToUppercaseFn from '~/common/functions/toFirstLetterUppercaseFn.ts';

export const applyConsumerAccessorFn = <T, P>(decorator: DecoratorType<T, P>, decoration?: DecorationType<P & ConsumerParameterType>) => {
  
  const context = decorator.context as any

  let decoratorProvider: ConsumerObjectParameterType = {};
  if (isStringFn(decoration?.parameters)) {
    decoratorProvider[decoration.parameters] = { optional: true };
  }
  if (isClassFn(decoration?.parameters)) {
    decoratorProvider[decoration.parameters.name] = { optional: true };
  }
  if (isConsumerObjectParameterFn(decoration?.parameters)) {
    decoratorProvider = decoration.parameters;
  }

  return {
    set: function () {},
    get: function () {
      if (!context.name) return undefined;

      let providerName = context.name;
      if (isStringFn(decoration?.parameters)) {
        providerName = decoration.parameters;
      }
      if (isClassFn(decoration?.parameters)) {
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
