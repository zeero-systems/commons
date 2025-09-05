import type { DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/Decorator.ts';
import GreaterThan from '~/validator/validations/GreaterThan.ts';

export default (comparison: number | string | Date | any[]): DecoratorFunctionType => Decorator.apply(GreaterThan, [comparison]);
