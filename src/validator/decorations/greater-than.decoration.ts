import type { DecorationFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import GreaterThanValidation from '~/validator/validations/greater-than.validation.ts';

export const GreaterThan: DecorationFunctionType<typeof GreaterThanValidation>  = Decorator.create(GreaterThanValidation)

export default GreaterThan
