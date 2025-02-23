import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, ArtifactType } from '~/decorator/types.ts';
import type { ConsumerObjectParameterType, ConsumerParameterType } from '~/container/types.ts';

import AnnotationException from '~/decorator/exceptions/AnnotationException.ts';
import Common from '~/common/services/Common.ts';
import Container from '~/container/services/Container.ts';
import Decorator from '~/decorator/services/Decorator.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import Metadata from '~/common/services/Metadata.ts';
import ProviderException from '~/container/exceptions/ProviderException.ts';

import isStringFn from '~/common/guards/isStringFn.ts';
import isClassFn from '~/common/guards/isClassFn.ts';
import isConsumerObjectParameterFn from '~/container/guards/isConsumerObjectParameterFn.ts';
import Text from '~/common/services/Text.ts';

export class Consumer implements AnnotationInterface {
  onAttach<P>(artifact: ArtifactType, decoration: DecorationType<P & ConsumerParameterType>): any {
    
    let target = artifact.target as any;
    const targetName = artifact.name;
    const context = decoration.context as any;

    let decoratorProvider: ConsumerObjectParameterType = {};
    if (isStringFn(decoration.parameters)) {
      decoratorProvider[decoration.parameters] = { optional: true };
    }
    if (isClassFn(decoration.parameters)) {
      decoratorProvider[decoration.parameters.name] = { optional: true };
    }
    if (isConsumerObjectParameterFn(decoration.parameters)) {
      decoratorProvider = decoration.parameters;
    }

    if (context.kind == DecoratorKindEnum.CLASS) {

      if (!Metadata.getProperty(target, Common.singleton)) {
        target = new Proxy(target as any, {
          construct(currentTarget, currentArgs, newTarget) {
            if (currentTarget.prototype !== newTarget.prototype) {
              return Reflect.construct(currentTarget, currentArgs, newTarget);
            }

            if (artifact.parameters) {
              for (let index = 0; index < artifact.parameters.length; index++) {
                const providerName = Text.toFirstLetterUppercase(String(artifact.parameters[index]));

                if (
                  !Container.exists(providerName) &&
                  !decoratorProvider[providerName]?.optional
                ) {
                  throw new ProviderException('Provider {name} not found', {
                    key: 'NOT_FOUND',
                    context: { name: providerName },
                  });
                }

                currentArgs[index] = Container.construct(providerName);
              }
            }

            return Reflect.construct(currentTarget, currentArgs, newTarget);
          },
        });

        target.toString = Function.prototype.toString.bind(artifact.target)
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

          providerName = Text.toFirstLetterUppercase(providerName);

          if (
            !Container.exists(providerName) &&
            decoratorProvider[providerName] &&
            !decoratorProvider[providerName].optional
          ) {
            throw new ProviderException('Provider {name} not found', {
              key: 'NOT_FOUND',
              context: { name: providerName },
            });
          }

          return Container.construct(providerName);
        },
        thrownable: true,
        propertyDecorator: {
          enumerable: true,
          configurable: true,
        },
      };
    }

    throw new AnnotationException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: targetName, kind: context.kind },
    });
  }
}

export default (parameters?: ConsumerParameterType) => Decorator.apply(Consumer, parameters);
