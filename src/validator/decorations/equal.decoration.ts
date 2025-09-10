import Decorator from '~/decorator/services/decorator.service.ts';
import EqualValidation from '~/validator/validations/equal.validation.ts';

export const Equal = Decorator.create(EqualValidation)

export default Equal