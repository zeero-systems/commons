import type { DecoratorType } from '~/decorator/types.ts';

export const applySingletonProxyFn = <T, P>(decorator: DecoratorType<T, P>) => {
	const target = decorator.target as any;
	const targetName = decorator.targetName;
	const context = decorator.context;

	if (!context.metadata.singleton) {
		return new Proxy(target, {
			construct(currentTarget, decoratorArgs, newTarget) {
				if (currentTarget.prototype !== newTarget.prototype) {
					return Reflect.construct(currentTarget, decoratorArgs, newTarget);
				}

				if (!context.metadata.singleton) {
					context.metadata.singleton = Reflect.construct(currentTarget, decoratorArgs, newTarget);
				}

				return context.metadata.singleton;
			},
		});
	}

	return decorator.target;
};

export default applySingletonProxyFn;
