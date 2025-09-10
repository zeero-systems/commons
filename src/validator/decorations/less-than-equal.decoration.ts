import Decorator from '~/decorator/services/decorator.service.ts';
import LessThanEqualValidation from '~/validator/validations/less-than-equal.validation.ts';

export const LessThanEqual = Decorator.create(LessThanEqualValidation)

export default LessThanEqual