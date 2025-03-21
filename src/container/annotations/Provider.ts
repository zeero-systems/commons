import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorFunctionType } from '~/decorator/types.ts';
import type { ArtifactType } from '~/common/types.ts';

import AnnotationException from '~/decorator/exceptions/AnnotationException.ts';
import Artifactor from '~/common/services/Artifactor.ts';
import Decorator from '~/decorator/services/Decorator.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import Factory from '~/common/services/Factory.ts';
import Locator from '~/container/services/Locator.ts';
import Tagger from '~/common/services/Tagger.ts';
import Text from '~/common/services/Text.ts';

export class Provider implements AnnotationInterface {
  onAttach<P>(artifact: ArtifactType, decoration: DecorationType<P>): any {
    if (decoration.kind == DecoratorKindEnum.CLASS) {
      const targetName = Text.toFirstLetterUppercase(artifact.name)

      Artifactor.set(targetName, { 
        name: targetName,
        target: artifact.target
      })

      Tagger.setDecorarion(Locator.provider, decoration)

      return artifact.target;
    }

    throw new AnnotationException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: artifact.name, kind: decoration.kind },
    });
  }
}

export default (): DecoratorFunctionType => Decorator.apply(Provider);
