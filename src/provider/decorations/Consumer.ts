import type { DecorationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorType } from '~/decorator/types.ts';
import type { ConsumerObjectParameterType, ConsumerParameterType } from '~/provider/types.ts';

import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import DecoratorException from '~/decorator/exceptions/DecoratorException.ts';
import Injector from '~/provider/services/Injector.ts';
import Metadata from '~/decorator/services/Metadata.ts';
import MetadataTagEnum from '~/common/enums/MetadataTagEnum.ts';
import ProviderException from '~/provider/exceptions/ProviderException.ts';

import decorateFn from '~/decorator/functions/decorateFn.ts';
import isStringFn from '~/common/guards/isStringFn.ts';
import isClassFn from '~/common/guards/isClassFn.ts';
import isConsumerObjectParameterFn from '~/provider/guards/isConsumerObjectParameterFn.ts';
import firstLetterUppercaseFn from '~/common/functions/firstLetterUppercaseFn.ts';

export class Consumer implements DecorationInterface {
  group: DecoratorGroupEnum = DecoratorGroupEnum.COMMONS;

  onAttach<T, P>(decorator: DecoratorType<T, P>, decoration?: DecorationType<P & ConsumerParameterType>): any {
    
    let target = decorator.target as any;
    const targetName = decorator.targetName;
    const context = decorator.context as any;

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

    if (context.kind == DecoratorKindEnum.CLASS) {
      if (!Metadata.hasTag<T, P>(context, MetadataTagEnum.CONSUMER)) {
        Metadata.applyTag<T, P>(context, MetadataTagEnum.CONSUMER);

        target = new Proxy(target as any, {
          construct(currentTarget, currentArgs, newTarget) {
            if (currentTarget.prototype !== newTarget.prototype) {
              return Reflect.construct(currentTarget, currentArgs, newTarget);
            }

            if (decorator?.targetParameters) {
              for (let index = 0; index < decorator?.targetParameters.length; index++) {
                const providerName = firstLetterUppercaseFn(String(decorator?.targetParameters[index]));

                if (
                  !Injector.exists(providerName) &&
                  !decoratorProvider[providerName]?.optional
                ) {
                  throw new ProviderException('Provider {name} not found', {
                    key: 'NOT_FOUND',
                    context: { name: providerName },
                  });
                }

                currentArgs[index] = Injector.construct(providerName);
              }
            }

            return Reflect.construct(currentTarget, currentArgs, newTarget);
          },
        });

        target.toString = Function.prototype.toString.bind(decorator.target)
      }

      return target;
    }

    if (context.kind == DecoratorKindEnum.ACCESSOR) {
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

          providerName = firstLetterUppercaseFn(providerName);

          if (
            !Injector.exists(providerName) &&
            decoratorProvider[providerName] &&
            !decoratorProvider[providerName].optional
          ) {
            throw new ProviderException('Provider {name} not found', {
              key: 'NOT_FOUND',
              context: { name: providerName },
            });
          }

          return Injector.construct(providerName);
        },
        thrownable: true,
        propertyDecorator: {
          enumerable: true,
          configurable: true,
        },
      };
    }

    throw new DecoratorException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: targetName, kind: context.kind },
    });
  }
}

export default (parameters?: ConsumerParameterType) => decorateFn(Consumer, parameters);
