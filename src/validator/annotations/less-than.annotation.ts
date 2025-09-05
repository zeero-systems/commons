import type { DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import LessThan from '~/validator/validations/less-than.validation.ts';

export default (comparison: number | string | Date | any[]): DecoratorFunctionType => Decorator.apply(LessThan, [comparison]);
