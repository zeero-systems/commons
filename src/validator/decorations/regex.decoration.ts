import type { DecorationFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import RegexValidation from '~/validator/validations/regex.validation.ts';

export const Regex: DecorationFunctionType<typeof RegexValidation>  = Decorator.create(RegexValidation)

export default Regex
