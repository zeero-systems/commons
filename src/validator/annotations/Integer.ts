import type { DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/Decorator.ts';
import Integer from '~/validator/validations/Integer.ts';

export default (): DecoratorFunctionType => Decorator.apply(Integer);
