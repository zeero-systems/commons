import Decorator from '~/decorator/services/decorator.service.ts';
import RegexValidation from '~/validator/validations/regex.validation.ts';

export const Regex = Decorator.create(RegexValidation)

export default Regex