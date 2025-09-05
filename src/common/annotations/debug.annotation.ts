import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorFunctionType } from '~/decorator/types.ts';
import type { ArtifactType } from '~/common/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';

export class Debug implements AnnotationInterface {
  public static readonly metadata: unique symbol = Symbol('Debug.metadata');

  onAttach<P>(artifact: ArtifactType, decoration?: DecorationType<P>): any {
    console.debug('onAttach', { artifact, decoration });
  }

  onInitialize<P>(artifact: ArtifactType, decoration?: DecorationType<P>): any {
    console.debug('onInitialize', { artifact, decoration });
  }
}

export default (): DecoratorFunctionType => Decorator.apply(Debug);
