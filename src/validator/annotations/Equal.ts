import Decorator from '~/decorator/services/Decorator.ts';
import Equal from '~/validator/validations/Equal.ts';

export default (comparison: number | string | Date | any[]) => Decorator.apply(Equal, comparison);
