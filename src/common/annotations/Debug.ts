import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorFunctionType } from '~/decorator/types.ts';
import type { ArtifactType, TagType } from '~/common/types.ts';

import Decorator from '~/decorator/services/Decorator.ts';

export class Debug implements AnnotationInterface {
  public static readonly metaTags: Array<symbol> = [Symbol('Debug.tag')];

  onAttach<P>(artifact: ArtifactType, decoration?: DecorationType<P>): any {
    console.debug('onAttach', { artifact, decoration });
  }

  onInitialize<P>(artifact: ArtifactType, decoration?: DecorationType<P>): any {
    console.debug('onInitialize', { artifact, decoration });
  }
}

export default (): DecoratorFunctionType => Decorator.apply(Debug);
