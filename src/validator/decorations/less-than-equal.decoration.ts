import type { DecorationFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import LessThanEqualValidation from '~/validator/validations/less-than-equal.validation.ts';

export const LessThanEqual: DecorationFunctionType<typeof LessThanEqualValidation>  = Decorator.create(LessThanEqualValidation)

export default LessThanEqual
