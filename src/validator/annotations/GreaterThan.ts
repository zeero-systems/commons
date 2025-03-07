import Decorator from '~/decorator/services/Decorator.ts';
import GreaterThan from '~/validator/validations/GreaterThan.ts';

export default (comparison: number | string | Date | any[]) => Decorator.apply(GreaterThan, comparison);
