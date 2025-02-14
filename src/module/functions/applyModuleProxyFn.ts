import type { DecorationType, DecoratorType } from '~/decorator/types.ts';
import type { ModuleParametersType } from '~/module/types.ts';

import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import Metadata from '~/decorator/services/Metadata.ts';
import MetadataTagEnum from '~/common/enums/MetadataTagEnum.ts';
import Module from '~/module/services/Module.ts';

import applyConsumerProxyFn from '~/provider/functions/applyConsumerProxyFn.ts';
import applyProviderProxyFn from '~/provider/functions/applyProviderProxyFn.ts';
import applySingletonProxyFn from '~/common/functions/applySingletonProxyFn.ts';
import toFirstLetterToUppercaseFn from '~/common/functions/toFirstLetterUppercaseFn.ts';

export const applyModuleProxyFn = <T, P>(
  decorator: DecoratorType<T, P>,
  decoration?: DecorationType<P & ModuleParametersType>,
): [DecoratorType<T, P>, DecorationType<any> | undefined] => {
  const context = decorator.context as any;
  const targetName = decorator.targetName;

  if (!Metadata.hasTag<T, P>(context, MetadataTagEnum.MODULE)) {
    Metadata.applyTag<T, P>(context, MetadataTagEnum.MODULE);

    decorator.target = new Proxy(decorator.target as any, {
      construct(currentTarget, currentArgs, newTarget) {
        if (currentTarget.prototype !== newTarget.prototype) {
          return Reflect.construct(currentTarget, currentArgs, newTarget);
        }

        if (decoration?.parameters?.providers) {
          for (let index = 0; index < decoration.parameters.providers.length; index++) {
            const providerTarget = decoration.parameters.providers[index];
            const providerTargetName = toFirstLetterToUppercaseFn(providerTarget.name || providerTarget.constructor.name);

            const providerDecorator: DecoratorType<any, P> = {
              target: providerTarget,
              targetName: providerTargetName,
              targetParameters: [],
              context: {
                kind: DecoratorKindEnum.CLASS,
                name: providerTargetName,
                metadata: Metadata.applyMetadata(providerTarget),
              } as any,
            };

            applyProviderProxyFn(...applySingletonProxyFn(providerDecorator));
          }
        }

        if (decoration?.parameters?.consumers) {
          for (let index = 0; index < decoration.parameters.consumers.length; index++) {
            const consumerTarget = decoration.parameters.consumers[index];
            const consumerTargetName = toFirstLetterToUppercaseFn(consumerTarget.name || consumerTarget.constructor.name);

            const consumerDecorator: DecoratorType<any, P> = {
              target: consumerTarget,
              targetName: consumerTargetName,
              targetParameters: [],
              context: {
                kind: DecoratorKindEnum.CLASS,
                name: consumerTargetName,
                metadata: Metadata.applyMetadata(consumerTarget),
              } as any,
            };

            applyConsumerProxyFn(consumerDecorator);
          }
        }

        return Reflect.construct(currentTarget, currentArgs, newTarget);
      },
    });

    Module.set(decorator.target as any, targetName);
  }

  return [decorator, decoration];
};

export default applyModuleProxyFn;
