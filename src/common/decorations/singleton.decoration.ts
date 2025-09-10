import type { DecorationFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import SingletonAnnotation from '~/common/annotations/singleton.annotation.ts';

export const Singleton: DecorationFunctionType<typeof SingletonAnnotation>  = Decorator.create(SingletonAnnotation)

export default Singleton