import type { DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/Decorator.ts';
import LessThan from '~/validator/validations/LessThan.ts';

export default (comparison: number | string | Date | any[]): DecoratorFunctionType => Decorator.apply(LessThan, comparison);
