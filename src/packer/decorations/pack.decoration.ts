import type { DecorationFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import PackAnnotation from '~/packer/annotations/pack.annotation.ts'

export const Pack: DecorationFunctionType<typeof PackAnnotation> = Decorator.create(PackAnnotation)

export default Pack
