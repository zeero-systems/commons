import type { DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import GreaterThanEqual from '~/validator/validations/greater-than-equal.validation.ts';

export default (comparison: number | string | Date | any[]): DecoratorFunctionType => Decorator.apply(GreaterThanEqual, [comparison]);
