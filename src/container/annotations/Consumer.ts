import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, ArtifactType, DecoratorFunctionType } from '~/decorator/types.ts';
import type { ConsumerObjectType, ConsumerParameterType } from '~/container/types.ts';

import AnnotationException from '~/decorator/exceptions/AnnotationException.ts';
import Container from '~/container/services/Container.ts';
import Decorator from '~/decorator/services/Decorator.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import ProviderException from '~/container/exceptions/ProviderException.ts';

import isString from '~/common/guards/isString.ts';
import isClass from '~/common/guards/isClass.ts';
import isConsumerObject from '~/container/guards/isConsumerObject.ts';
import Text from '~/common/services/Text.ts';
import Common from '~/common/services/Common.ts';

export class Consumer implements AnnotationInterface {
  onAttach<P>(artifact: ArtifactType, decoration: DecorationType<P & ConsumerParameterType>): any {
    
    const targetName = artifact.name;
    const context = decoration.context as any;

    let providers: ConsumerObjectType = {};
    if (isString(decoration.parameters)) {
      providers[decoration.parameters] = { optional: true };
    }
    if (isClass(decoration.parameters)) {
      providers[decoration.parameters.name] = { optional: true };
    }
    if (isConsumerObject(decoration.parameters)) {
      providers = decoration.parameters;
    }

    if (context.kind == DecoratorKindEnum.CLASS) {

      if (!Decorator.hasAnnotation(artifact.target, Consumer)) {
        artifact.target = new Proxy(artifact.target as any, {
          construct(currentTarget, currentArgs, newTarget) {
            if (currentTarget.prototype !== newTarget.prototype) {
              return Reflect.construct(currentTarget, currentArgs, newTarget);
            }

            const common = context.metadata[Common.metadata]

            if (common.construct.parameters) {
              for (let index = 0; index < common.construct.parameters.length; index++) {
                const providerName = Text.toFirstLetterUppercase(String(common.construct.parameters[index]));

                if (
                  !Container.exists(providerName) &&
                  providers[providerName]?.optional === false
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
            providers[providerName]?.optional === false
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

export default (parameter?: ConsumerParameterType): DecoratorFunctionType => Decorator.apply(Consumer, parameter);
