import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorFunctionType } from '~/decorator/types.ts';
import type { ArtifactType } from '~/common/types.ts';

import AnnotationException from '~/decorator/exceptions/AnnotationException.ts';
import Artifactor from '~/common/services/Artifactor.ts';
import Decorator from '~/decorator/services/Decorator.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import Text from '~/common/services/Text.ts';
import Locator from '~/container/services/Locator.ts';
import Tagger from '~/common/services/Tagger.ts';
import Scope from '~/container/services/Scope.ts';
import ScopeEnum from '~/container/enums/ScopeEnum.ts';
import Factory from '~/common/services/Factory.ts';

export class Consumer implements AnnotationInterface {
  onAttach<P>(artifact: ArtifactType, decoration: DecorationType<P & { scope: ScopeEnum }>): any {
    if (decoration.kind == DecoratorKindEnum.CLASS) {
      const scope = decoration.parameters?.scope || ScopeEnum.Transient
      const targetName = Text.toFirstLetterUppercase(artifact.name)

      Artifactor.set(targetName, { 
        name: targetName,
        target: artifact.target
      })

      Scope.setDecoration(scope, decoration)
      Tagger.setDecorarion(Locator.consumer, decoration)

      return artifact.target;
    }

    throw new AnnotationException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: artifact.name, kind: decoration.kind },
    });
  }
}

export default (scope: ScopeEnum = ScopeEnum.Transient): DecoratorFunctionType => Decorator.apply(Consumer, { scope });
