import type { DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import LessThanEqual from '~/validator/validations/less-than-equal.validation.ts';

export default (comparison: number | string | Date | any[]): DecoratorFunctionType => Decorator.apply(LessThanEqual, [comparison]);
