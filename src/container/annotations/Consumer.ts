import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, ArtifactType, DecoratorFunctionType } from '~/decorator/types.ts';
import type { ConsumerObjectParameterType, ConsumerParameterType } from '~/container/types.ts';

import AnnotationException from '~/decorator/exceptions/AnnotationException.ts';
import Common from '~/common/services/Common.ts';
import Container from '~/container/services/Container.ts';
import Decorator from '~/decorator/services/Decorator.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import Metadata from '~/common/services/Metadata.ts';
import ProviderException from '~/container/exceptions/ProviderException.ts';

import isString from '~/common/guards/isString.ts';
import isClass from '~/common/guards/isClass.ts';
import isConsumerObjectParameter from '~/container/guards/isConsumerObjectParameter.ts';
import Text from '~/common/services/Text.ts';

import { Singleton } from '~/common/annotations/Singleton.ts';

export class Consumer implements AnnotationInterface {
  onAttach<P>(artifact: ArtifactType, decoration: DecorationType<P & ConsumerParameterType>): any {
    
    const targetName = artifact.name;
    const context = decoration.context as any;

    let decoratorProvider: ConsumerObjectParameterType = {};
    if (isString(decoration.parameters)) {
      decoratorProvider[decoration.parameters] = { optional: true };
    }
    if (isClass(decoration.parameters)) {
      decoratorProvider[decoration.parameters.name] = { optional: true };
    }
    if (isConsumerObjectParameter(decoration.parameters)) {
      decoratorProvider = decoration.parameters;
    }

    if (context.kind == DecoratorKindEnum.CLASS) {

      if (!Decorator.hasAnnotation(artifact.target, Singleton)) {
        artifact.target = new Proxy(artifact.target as any, {
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

        artifact.target.toString = Function.prototype.toString.bind(artifact.target)
      }

      return artifact.target;
    }

    if (context.kind == DecoratorKindEnum.ACCESSOR) {
      return {
        set: function () {},
        get: function () {
          if (!context.name) return undefined;

          let providerName = context.name;
          if (isString(decoration?.parameters)) {
            providerName = decoration.parameters;
          }
          if (isClass(decoration?.parameters)) {
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

export default (parameters?: ConsumerParameterType): DecoratorFunctionType => Decorator.apply(Consumer, parameters);
