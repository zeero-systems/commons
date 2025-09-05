import type { DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import GreaterThan from '~/validator/validations/greater-than.validation.ts';

export default (comparison: number | string | Date | any[]): DecoratorFunctionType => Decorator.apply(GreaterThan, [comparison]);
