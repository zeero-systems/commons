import type { ComponentParametersType } from '~/module/types.ts';
import type { DecorationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorType } from '~/decorator/types.ts';

import Consumer from '~/provider/decorations/Consumer.ts';
import DecoratorException from '~/decorator/exceptions/DecoratorException.ts';
import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import Mixin from '~/decorator/decorations/Mixin.ts';
import Metadata from '~/decorator/services/Metadata.ts';
import MetadataTagEnum from '~/common/enums/MetadataTagEnum.ts';
import Modulator from '~/module/services/Modulator.ts';
import Provider from '~/provider/decorations/Provider.ts';
import Singleton from '~/common/decorations/Singleton.ts';

import decorateFn from '~/decorator/functions/decorateFn.ts';
import firstLetterUppercaseFn from '~/common/functions/firstLetterUppercaseFn.ts';

export class Component implements DecorationInterface {
  group: DecoratorGroupEnum = DecoratorGroupEnum.COMMONS;

  onAttach<T, P>(decorator: DecoratorType<T, P>, decoration?: DecorationType<P & ComponentParametersType>) {
    let target = decorator.target as any
    const targetName = decorator.targetName;
    const context = decorator.context as any;

    if (decorator.context.kind == DecoratorKindEnum.CLASS) {
      if (!Metadata.hasTag<T, P>(context, MetadataTagEnum.COMPONENT)) {
        Metadata.applyTag<T, P>(context, MetadataTagEnum.COMPONENT);

        // decorator.target = Mixin([Consumer(), Singleton()])(decorator.target, context);
        target = new Proxy(target, {
          construct(currentTarget, currentArgs, newTarget) {
            if (currentTarget.prototype !== newTarget.prototype) {
              return Reflect.construct(currentTarget, currentArgs, newTarget);
            }
            if (decoration?.parameters?.providers) {
              for (let index = 0; index < decoration.parameters.providers.length; index++) {
                const providerTarget = decoration.parameters.providers[index];
                const providerContext = {
                  kind: DecoratorKindEnum.CLASS,
                  name: firstLetterUppercaseFn(providerTarget.name || providerTarget.constructor.name),
                  metadata: Metadata.applyMetadata(providerTarget),
                } as any;

                Mixin([Provider(), Singleton()])(providerTarget, providerContext);
              }
            }

            if (decoration?.parameters?.consumers) {
              for (let index = 0; index < decoration.parameters.consumers.length; index++) {
                const consumerTarget = decoration.parameters.consumers[index];
                const consumerContext = {
                  kind: DecoratorKindEnum.CLASS,
                  name: firstLetterUppercaseFn(consumerTarget.name || consumerTarget.constructor.name),
                  metadata: Metadata.applyMetadata(consumerTarget),
                } as any;

                Mixin([Consumer(), Provider()])(consumerTarget, consumerContext);
              }
            }

            return Reflect.construct(currentTarget, currentArgs, newTarget);
          },
        });

        target.toString = Function.prototype.toString.bind(decorator.target)

        Modulator.set(target as any, targetName);
      }

      return target
    }

    throw new DecoratorException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: targetName, kind: context.kind },
    });
  }
}

export default (parameters?: ComponentParametersType) => decorateFn(Component, parameters);
