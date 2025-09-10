import Decorator from '~/decorator/services/decorator.service.ts';
import DebugAnnotation from '~/common/annotations/debug.annotation.ts';

export const Debug = Decorator.create(DebugAnnotation)

export default Debug