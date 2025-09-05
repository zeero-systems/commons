import type { DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import Equal from '~/validator/validations/equal.validation.ts';

export default (comparison: number | string | Date | any[]): DecoratorFunctionType => Decorator.apply(Equal, [comparison]);
