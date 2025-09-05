import type { DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import Integer from '~/validator/validations/integer.validation.ts';

export default (): DecoratorFunctionType => Decorator.apply(Integer);
