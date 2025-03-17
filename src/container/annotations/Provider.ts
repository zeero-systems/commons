import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { ArtifactType, DecorationType, DecoratorFunctionType } from '~/decorator/types.ts';

import AnnotationException from '~/decorator/exceptions/AnnotationException.ts';
import Container from '~/container/services/Container.ts';
import Decorator from '~/decorator/services/Decorator.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import Text from '~/common/services/Text.ts';
import ProviderException from '~/container/exceptions/ProviderException.ts';

export class Provider implements AnnotationInterface {
  onAttach<P>(artifact: ArtifactType, decoration: DecorationType<P>): any {
    if (decoration.kind == DecoratorKindEnum.CLASS) {
      const targetName = Text.toFirstLetterUppercase(artifact.name)
      
      if (Container.exists(targetName)) {
        throw new ProviderException('A provider with same name {name} already exists.', {
          key: 'EXCEPTION',
          context: { name: artifact.name, kind: decoration.kind },
        });    
      }

      Container.set(Text.toFirstLetterUppercase(artifact.name), artifact.target);

      return artifact.target;
    }

    throw new AnnotationException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: artifact.name, kind: decoration.kind },
    });
  }
}

export default (): DecoratorFunctionType => Decorator.apply(Provider);
