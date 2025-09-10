import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { DecoratorType } from '~/decorator/types.ts';
import type { ArtifactType, KeyType } from '~/common/types.ts';

export class DebugAnnotation implements AnnotationInterface {
  public static readonly metadata: unique symbol = Symbol('Debug.metadata');

  onAttach(artifact: ArtifactType, decorator: DecoratorType): any {
    console.debug('onAttach', { artifact, decorator });
  }

  onInitialize(artifact: ArtifactType, decorator: DecoratorType): any {
    console.debug('onInitialize', { artifact, decorator });
  }
}

export default DebugAnnotation