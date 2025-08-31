import type { DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/Decorator.ts';
import Equal from '~/validator/validations/Equal.ts';

export default (comparison: number | string | Date | any[]): DecoratorFunctionType => Decorator.apply(Equal, { parameters: [comparison] });
