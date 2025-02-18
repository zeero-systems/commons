import type { MetadataType } from '~/decorator/types.ts';
import type { ConstructorArgType } from '~/common/types.ts';

import MetadataTagEnum from '~/common/enums/MetadataTagEnum.ts';

import isNumberFn from '~/common/guards/isNumberFn.ts';

export const constructFn = <T>(
  target: new (...args: any[]) => T,
  targetOptions?: {
    arguments?: ConstructorArgType<T>;
  },
): T => {
  const namedArguments: any = {};
  const indexedArguments: any[] = [];
  const targetMetadata = target[Symbol.metadata] as MetadataType<T, ConstructorArgType<T>>;

  if (targetOptions?.arguments) {
    Object.entries(targetOptions?.arguments).forEach(([key, value]) => {
      if (isNumberFn(key)) {
        indexedArguments[Number(key)] = value;
      } else {
        namedArguments[key] = value;
      }
    });
  }

  const canUpdateProperties = !targetMetadata ||
    (targetMetadata.tags?.includes(MetadataTagEnum.SINGLETON) && !targetMetadata.singleton);

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
