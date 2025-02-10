import type { DecoratorMetadataType } from '~/decorator/types.ts';
import type { ArgType } from '~/common/types.ts';

import ContextTagEnum from '~/decorator/enums/ContextTagEnum.ts';

import guardNumberFn from '~/common/guards/guardNumberFn.ts';

export const constructFn = <T>(
  target: new (...args: any) => T,
  targetOptions?: {
    arguments?: ArgType<T>;
  },
): InstanceType<new (...args: any) => T> => {
  const namedArguments: any = {};
  const indexedArguments: any[] = [];
  const targetMetadata = target[Symbol.metadata] as DecoratorMetadataType<T, ArgType<T>>;

  if (targetOptions?.arguments) {
    Object.entries(targetOptions?.arguments).forEach(([key, value]) => {
      if (guardNumberFn(key)) {
        indexedArguments[Number(key)] = value;
      } else {
        namedArguments[key] = value;
      }
    });
  }

  const canUpdateProperties = !targetMetadata || (targetMetadata.tags?.includes(ContextTagEnum.SINGLETON) && !targetMetadata.singleton);

  const targetInstance = Reflect.construct(target, indexedArguments);

  if (canUpdateProperties) {
    Object.entries(namedArguments).reduce((t: any, [key]: any) => {
      if (Object.hasOwnProperty.call(t, key)) {
        t[key] = namedArguments[key];
      }
      return t;
    }, targetInstance);
  }

  return targetInstance;
};

export default constructFn;
