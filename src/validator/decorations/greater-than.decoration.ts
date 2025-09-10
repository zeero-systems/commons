import Decorator from '~/decorator/services/decorator.service.ts';
import GreaterThanValidation from '~/validator/validations/greater-than.validation.ts';

export const GreaterThan = Decorator.create(GreaterThanValidation)

export default GreaterThan