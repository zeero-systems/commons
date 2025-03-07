import type { DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/Decorator.ts';
import Required from '~/validator/validations/Required.ts';

export default (): DecoratorFunctionType => Decorator.apply(Required);
