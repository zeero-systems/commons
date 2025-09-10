import type { DecorationFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import DebugAnnotation from '~/common/annotations/debug.annotation.ts';

export const Debug: DecorationFunctionType<typeof DebugAnnotation>  = Decorator.create(DebugAnnotation)

export default Debug