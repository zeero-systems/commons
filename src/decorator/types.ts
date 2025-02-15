import type ArrayMap from '~/structure/services/ArrayMap.ts';
import type { DecorationInterface } from '~/decorator/interfaces.ts';
import type { ConstructorType } from '~/common/types.ts';

import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';
import MetadataTagEnum from '~/common/enums/MetadataTagEnum.ts';

export type AutoAccessorType = {
  get: () => any;
  set: (value: any) => void;
};

// deno-lint-ignore ban-types
export type DecoratorTargetType<T> = ConstructorType<T> | AutoAccessorType | Function | undefined;

export type DecorationType<P> = {
  target: DecorationInterface;
  parameters?: P;
};

export type DecoratorType<T, P> = {
  target: T;
  targetName: string;
  targetParameters: string[];
  context: DecoratorContextType<T, P>;
};

export type DecoratorContextType<T, P> = DecoratorContext & {
  metadata: MetadataType<T, P>;
};

export type DecoratorPropertyType = string | number | symbol;

export type MetadataType<T, P> = {
  tags?: MetadataTagEnum[];
  singleton?: T;
  decorators?: MetadataDecoratorType<P>;
};

export type MetadataDecoratorType<P> = Map<DecoratorPropertyType, ArrayMap<DecoratorGroupEnum, DecorationType<P>>>

export type DecorationFunctionType<T> = (target: T, context: DecoratorContextType<T, any>) => any

export default {};