import type { DecorationInterface } from '~/decorator/interfaces.ts';

import RequiredValidation from '~/validator/validations/Required.ts';
import Singleton from '~/common/decorations/Singleton.ts';

import applyDecorationFn from '~/decorator/functions/applyDecorationFn.ts';
import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';

@Singleton()
export class Required extends RequiredValidation implements DecorationInterface {
  group = DecoratorGroupEnum.VALIDATIONS
}

export default () => applyDecorationFn(Required);
