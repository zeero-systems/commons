import type { DecorationFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import EqualValidation from '~/validator/validations/equal.validation.ts';

export const Equal: DecorationFunctionType<typeof EqualValidation>  = Decorator.create(EqualValidation)

export default Equal
