import type { DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/Decorator.ts';
import Float from '~/validator/validations/Float.ts';

export default (): DecoratorFunctionType => Decorator.apply(Float);
