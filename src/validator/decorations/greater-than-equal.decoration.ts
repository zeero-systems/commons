import Decorator from '~/decorator/services/decorator.service.ts';
import GreaterThanEqualValidation from '~/validator/validations/greater-than-equal.validation.ts';

export const GreaterThanEqual = Decorator.create(GreaterThanEqualValidation)

export default GreaterThanEqual