import type { DecorationFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import LessThanValidation from '~/validator/validations/less-than.validation.ts';

export const LessThan: DecorationFunctionType<typeof LessThanValidation>  = Decorator.create(LessThanValidation)

export default LessThan
