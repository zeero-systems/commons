import type { DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import Regex from '~/validator/validations/regex.validation.ts';

export default (pattern: string | RegExp): DecoratorFunctionType => Decorator.apply(Regex, [pattern]);
