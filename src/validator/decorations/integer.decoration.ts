import type { DecorationFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import IntegerValidation from '~/validator/validations/integer.validation.ts';

export const Integer: DecorationFunctionType<typeof IntegerValidation>  = Decorator.create(IntegerValidation)

export default Integer
