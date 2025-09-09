import type { DecoratorType } from '~/decorator/types.ts';
import type { ArtifactType,  KeyType } from '~/common/types.ts';

/**
 * Annotation intefaces to implements decorators
 *
 * @interface AnnotationInterface
 *
 * @member {Function} onAttach - Called when the decorator is attached
 * @member {Function} onInitialize - Called when the decorator is initialized
 */
export interface AnnotationInterface {
  onAttach(artifact: ArtifactType, decorator: DecoratorType): any;
  onInitialize(artifact: ArtifactType, decorator: DecoratorType): any;
}
