import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, ArtifactType, DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/Decorator.ts';

export class Debug implements AnnotationInterface {
  onAttach<P>(artifact: ArtifactType, decoration?: DecorationType<P>): any {
    console.log('onAttach', { artifact, decoration });
  }

  onInitialize<P>(artifact: ArtifactType, decoration?: DecorationType<P>): any {
    console.log('onInitialize', { artifact, decoration });
  }
}

export default (): DecoratorFunctionType => Decorator.apply(Debug);
