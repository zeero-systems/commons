import type { DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import Float from '~/validator/validations/float.validation.ts';

export default (): DecoratorFunctionType => Decorator.apply(Float);
