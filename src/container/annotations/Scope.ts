import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorFunctionType } from '~/decorator/types.ts';
import type { ArtifactType } from '~/common/types.ts';

import AnnotationException from '~/decorator/exceptions/AnnotationException.ts';
import Decorator from '~/decorator/services/Decorator.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import ScopeEnum from '~/container/enums/ScopeEnum.ts';
import ScopeService from '../services/Scoper.ts';

export class Scope implements AnnotationInterface {
  onAttach<P>(artifact: ArtifactType, decoration: DecorationType<P & { scope: ScopeEnum }>): any {
    if (decoration.kind == DecoratorKindEnum.CLASS) {
      
      if (decoration.parameters?.scope) {
        ScopeService.setDecoration(decoration.parameters.scope, decoration)
      }

      return artifact.target;
    }

    throw new AnnotationException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: artifact.name, kind: decoration.kind },
    });
  }
}

export default (scope: ScopeEnum = ScopeEnum.Transient): DecoratorFunctionType => Decorator.apply(Scope, { scope });
