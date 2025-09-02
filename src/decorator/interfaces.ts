import type { DecorationType } from '~/decorator/types.ts';
import type { ArtifactType } from '~/common/types.ts';

/**
 * Annotation intefaces to implements decorators
 *
 * @interface AnnotationInterface
 *
 * @member {Function} onAttach - Called when the decorator is attached
 * @member {Function} onInitialize - Called when the decorator is initialized
 */
export interface AnnotationInterface {
  [x: string | symbol]: any;
  onAttach?<P>(artifact: ArtifactType, decoration: DecorationType<P>): any;
  onInitialize?<P>(artifact: ArtifactType, decoration: DecorationType<P>): any;
}
