import Decorator from '~/decorator/services/decorator.service.ts';
import RequiredValidation from '~/validator/validations/required.validation.ts';

export const Required = Decorator.create(RequiredValidation)

export default Required