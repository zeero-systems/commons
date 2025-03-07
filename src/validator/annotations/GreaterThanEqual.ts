import Decorator from '~/decorator/services/Decorator.ts';
import GreaterThanEqual from '~/validator/validations/GreaterThanEqual.ts';

export default (comparison: number | string | Date | any[]) => Decorator.apply(GreaterThanEqual, comparison);
