import type { DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/Decorator.ts';
import LessThanEqual from '~/validator/validations/LessThanEqual.ts';

export default (comparison: number | string | Date | any[]): DecoratorFunctionType => Decorator.apply(LessThanEqual, [comparison]);
