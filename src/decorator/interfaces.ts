import type { DecorationType, ArtifactType } from '~/decorator/types.ts';

/**
 * Annotation intefaces to implements decorators
 *
 * @interface AnnotationInterface
 *
 * @member {Function} onAttach - Called when the decorator is attached
 * @member {Function} onInitialize - Called when the decorator is initialized
 */
export interface AnnotationInterface {  
  onAttach?<P>(artifact: ArtifactType, decoration: DecorationType<P>): any;
  onInitialize?<P>(artifact: ArtifactType, decoration: DecorationType<P>): any;
}
