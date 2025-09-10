import type { DecorationFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import FloatValidation from '~/validator/validations/float.validation.ts';

export const Float: DecorationFunctionType<typeof FloatValidation>  = Decorator.create(FloatValidation)

export default Float
