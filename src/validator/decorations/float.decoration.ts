import Decorator from '~/decorator/services/decorator.service.ts';
import FloatValidation from '~/validator/validations/float.validation.ts';

export const Float = Decorator.create(FloatValidation)

export default Float