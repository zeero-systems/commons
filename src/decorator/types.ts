import type ArrayMap from '~/structure/services/ArrayMap.ts';
import type { DecorationInterface } from '~/decorator/interfaces.ts';
import type { ConstructorType } from '~/common/types.ts';
import ContextTagEnum from '~/decorator/enums/ContextTagEnum.ts';

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
	metadata: DecoratorMetadataType<T, P>
};

export type DecoratorPropertyType = string | number | symbol

export type DecoratorMetadataType<T, P> = {
  tags?: string[];
  singleton?: T;
  decorators?: Map<DecoratorPropertyType, ArrayMap<ContextTagEnum, DecorationType<P>>>
}


