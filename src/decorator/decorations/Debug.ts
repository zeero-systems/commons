import type { DecorationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorType } from '~/decorator/types.ts';

import applyDecorationFn from '~/decorator/functions/applyDecorationFn.ts';
import ContextTagEnum from '~/decorator/enums/ContextTagEnum.ts';

export class Debug implements DecorationInterface {
	tag = ContextTagEnum.COMMONS;

	onAttach<T, P>(decorator: DecoratorType<T, P>, decoration: DecorationType<P>) {
		console.log('onAttach', { decorator, decoration });
	}

	onInitialize<T, P>(decorator: DecoratorType<T, P>, decoration: DecorationType<P>) {
		console.log('onInitialize', { decorator, decoration });
	}
}

export default () => applyDecorationFn(Debug);
