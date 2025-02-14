import Metadata from '~/decorator/services/Metadata.ts';
import MetadataTagEnum from '~/common/enums/MetadataTagEnum.ts';
import { DecorationType, DecoratorType } from '~/decorator/types.ts';

export const applySingletonProxyFn = <T, P>(decorator: DecoratorType<T, P>, decoration?: DecorationType<P>): [DecoratorType<T, P>, DecorationType<any> | undefined] => {

  const context = decorator.context as any

  if (!Metadata.hasTag<T, P>(context, MetadataTagEnum.SINGLETON)) {
    Metadata.applyTag<T, P>(context, MetadataTagEnum.SINGLETON)

    decorator.target = new Proxy(decorator.target as any, {
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

  return [decorator, decoration];
};

export default applySingletonProxyFn;
