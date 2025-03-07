import Decorator from '~/decorator/services/Decorator.ts';
import LessThanEqual from '~/validator/validations/LessThanEqual.ts';

export default (comparison: number | string | Date | any[]) => Decorator.apply(LessThanEqual, comparison);
