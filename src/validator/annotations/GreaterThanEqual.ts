import type { DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/Decorator.ts';
import GreaterThanEqual from '~/validator/validations/GreaterThanEqual.ts';

export default (comparison: number | string | Date | any[]): DecoratorFunctionType => Decorator.apply(GreaterThanEqual, [comparison]);
