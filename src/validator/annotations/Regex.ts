import Decorator from '~/decorator/services/Decorator.ts';
import Regex from '~/validator/validations/Regex.ts';

export default (pattern: string | RegExp) => Decorator.apply(Regex, pattern);
