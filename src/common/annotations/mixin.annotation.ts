import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorFunctionType } from '~/decorator/types.ts';
import type { ArtifactType } from '~/common/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';

export class Mixin implements AnnotationInterface {
  onAttach<P>(artifact: ArtifactType, decoration: DecorationType<P & { annotations: DecoratorFunctionType[] }>): any {
    
    if (decoration.parameters) {
      for (let index = 0; index < decoration.parameters.annotations.length; index++) {
        artifact.target = decoration.parameters.annotations[index](artifact.target, decoration.context)
      }
    }

    return artifact.target
  }
}

export default (annotations: DecoratorFunctionType[]): DecoratorFunctionType => Decorator.apply(Mixin, { annotations }, { persists: false });