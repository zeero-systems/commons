import type { DecorationFunctionType } from '~/decorator/types.ts';

import ConsumerAnnotation from '~/container/annotations/consumer.annotation.ts'
import Decorator from '~/decorator/services/decorator.service.ts';

export const Consumer: DecorationFunctionType<typeof ConsumerAnnotation> = Decorator.create(ConsumerAnnotation)

export default Consumer
