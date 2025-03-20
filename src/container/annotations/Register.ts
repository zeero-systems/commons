import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorFunctionType } from '~/decorator/types.ts';
import type { KeyType } from '~/container/types.ts';

import AnnotationException from '~/decorator/exceptions/AnnotationException.ts';
import Decorator from '~/decorator/services/Decorator.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import Text from '~/common/services/Text.ts';
import Registry from '~/container/services/Registry.ts';
import ScopeEnum from '~/container/enums/ScopeEnum.ts';
import Scope from '~/container/services/Scope.ts';
import { ArtifactType } from '~/common/types.ts';

export class Register implements AnnotationInterface {
  onAttach<P>(artifact: ArtifactType, decoration: DecorationType<P & { scope: ScopeEnum, tag?: KeyType }>): any {
    if (decoration.kind == DecoratorKindEnum.CLASS) {
      const targetName = Text.toFirstLetterUppercase(artifact.name)

      if (!Registry.has(targetName)) {
        Registry.set(targetName, { 
          name: targetName,
          target: artifact.target, 
          parameters: artifact.parameters,
          tag: decoration.parameters?.tag
        })
      }

      if (!decoration.context.metadata[Scope.metadata]) {
        decoration.context.metadata[Scope.metadata] = decoration.parameters?.scope
      }

      return artifact.target;
    }

    throw new AnnotationException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: artifact.name, kind: decoration.kind },
    });
  }
}

export default (scope: ScopeEnum = ScopeEnum.Transient, tag?: KeyType): DecoratorFunctionType => Decorator.apply(Register, { scope, tag });
