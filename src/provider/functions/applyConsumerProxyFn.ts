import type { ConsumerObjectParameterType, ConsumerParameterType } from '~/provider/types.ts';
import type { DecorationType, DecoratorType } from '~/decorator/types.ts';

import Metadata from '~/decorator/services/Metadata.ts';
import MetadataTagEnum from '~/common/enums/MetadataTagEnum.ts';
import Provider from '~/provider/services/Provider.ts';
import ProviderException from '~/provider/exceptions/ProviderException.ts';

import isStringFn from '~/common/guards/isStringFn.ts';
import isClassFn from '~/common/guards/isClassFn.ts';
import isConsumerObjectParameterFn from '~/provider/guards/isConsumerObjectParameterFn.ts';
import toFirstLetterToUppercaseFn from '~/common/functions/toFirstLetterUppercaseFn.ts';

export const applyConsumerProxyFn = <T, P>(decorator: DecoratorType<T, P>, decoration?: DecorationType<P & ConsumerParameterType>): [DecoratorType<T, P>, DecorationType<any> | undefined] => {
  
  const context = decorator.context as any
  
  if (!Metadata.hasTag<T, P>(context, MetadataTagEnum.CONSUMER)) {
    Metadata.applyTag<T, P>(context, MetadataTagEnum.CONSUMER);

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

    decorator.target = new Proxy(decorator.target as any, {
      construct(currentTarget, currentArgs, newTarget) {
        if (currentTarget.prototype !== newTarget.prototype) {
          return Reflect.construct(currentTarget, currentArgs, newTarget);
        }
        
        if (decorator?.targetParameters) {
          for (let index = 0; index < decorator?.targetParameters.length; index++) {
            const providerName = toFirstLetterToUppercaseFn(String(decorator?.targetParameters[index]));
  
            if (
              !Provider.exists(providerName) &&
              !decoratorProvider[providerName]?.optional
            ) {
              throw new ProviderException('Provider {name} not found', {
                key: 'NOT_FOUND',
                context: { name: providerName },
              });
            }
  
            currentArgs[index] = Provider.construct(providerName);
          }
        }

        return Reflect.construct(currentTarget, currentArgs, newTarget);
      },
    });
  }

  return [decorator, decoration];
};

export default applyConsumerProxyFn;
