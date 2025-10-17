import type { DecorationFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import DescriptorAnnotation from '~/common/annotations/descriptor.annotation.ts';

export const Descriptor: DecorationFunctionType<typeof DescriptorAnnotation>  = Decorator.create(DescriptorAnnotation)

export default Descriptor