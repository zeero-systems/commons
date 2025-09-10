import Decorator from '~/decorator/services/decorator.service.ts';
import IntegerValidation from '~/validator/validations/integer.validation.ts';

export const Integer = Decorator.create(IntegerValidation)

export default Integer