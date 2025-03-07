import type { DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/Decorator.ts';
import Regex from '~/validator/validations/Regex.ts';

export default (pattern: string | RegExp): DecoratorFunctionType => Decorator.apply(Regex, pattern);
