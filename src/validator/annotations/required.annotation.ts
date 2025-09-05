import type { DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import Required from '~/validator/validations/required.validation.ts';

export default (): DecoratorFunctionType => Decorator.apply(Required);
