import type { DecorationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorType } from '~/decorator/types.ts';

import Context from '~/decorator/services/Context.ts';
import ContextTagEnum from '~/decorator/enums/ContextTagEnum.ts';
import RequiredValidation from '~/validator/validations/Required.ts';
import Singleton from '~/decorator/decorations/Singleton.ts';

import applyDecorationFn from '~/decorator/functions/applyDecorationFn.ts';

@Singleton()
export class Required extends RequiredValidation implements DecorationInterface {
	tag = ContextTagEnum.VALIDATIONS;
}

export default () => applyDecorationFn(Required)