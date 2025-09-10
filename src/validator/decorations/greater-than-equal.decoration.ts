import type { DecorationFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import GreaterThanEqualValidation from '~/validator/validations/greater-than-equal.validation.ts';

export const GreaterThanEqual: DecorationFunctionType<typeof GreaterThanEqualValidation>  = Decorator.create(GreaterThanEqualValidation)

export default GreaterThanEqual
