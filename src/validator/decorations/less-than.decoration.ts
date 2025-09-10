import Decorator from '~/decorator/services/decorator.service.ts';
import LessThanValidation from '~/validator/validations/less-than.validation.ts';

export const LessThan = Decorator.create(LessThanValidation)

export default LessThan