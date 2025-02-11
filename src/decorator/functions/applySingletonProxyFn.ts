import type { DecoratorType } from '~/decorator/types.ts';
import Metadata from '~/decorator/services/Metadata.ts';
import MetadataTagEnum from '~/common/enums/MetadataTagEnum.ts';

export const applySingletonProxyFn = <T, P>(decorator: DecoratorType<T, P>) => {
  const target = decorator.target as any;
  const targetName = decorator.targetName;
  const context = decorator.context;

  if (!Metadata.hasTag<T, P>(context.metadata, MetadataTagEnum.SINGLETON)) {
    Metadata.addTag<T, P>(context.metadata, MetadataTagEnum.SINGLETON)

    return new Proxy(target, {
      construct(currentTarget, currentArgs, newTarget) {
        if (currentTarget.prototype !== newTarget.prototype) {
          return Reflect.construct(currentTarget, currentArgs, newTarget);
        }

        if (!context.metadata.singleton) {
          context.metadata.singleton = Reflect.construct(currentTarget, currentArgs, newTarget);
        }

        return context.metadata.singleton;
      },
    });
  }

  return decorator.target;
};

export default applySingletonProxyFn;
