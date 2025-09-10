import type { DecorationFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import RequiredValidation from '~/validator/validations/required.validation.ts';

export const Required: DecorationFunctionType<typeof RequiredValidation>  = Decorator.create(RequiredValidation)

export default Required
