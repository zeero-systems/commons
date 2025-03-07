import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { ArtifactType, DecorationType, DecoratorFunctionType } from '~/decorator/types.ts';
import type { ProviderParameterType } from '~/container/types.ts';

import AnnotationException from '~/decorator/exceptions/AnnotationException.ts';
import Common from '~/common/services/Common.ts';
import Container from '~/container/services/Container.ts';
import Decorator from '~/decorator/services/Decorator.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import Metadata from '~/common/services/Metadata.ts';
import Text from '~/common/services/Text.ts';

export class Provider implements AnnotationInterface {
  onAttach<P>(artifact: ArtifactType, decoration: DecorationType<P & ProviderParameterType>): any {
    if (decoration.kind == DecoratorKindEnum.CLASS) {
      if (!Metadata.getProperty(artifact.target, Common.singleton)) {
        Container.set(artifact.target, Text.toFirstLetterUppercase(artifact.name));
      }

      return artifact.target;
    }

    throw new AnnotationException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: artifact.name, kind: decoration.kind },
    });
  }
}

export default (parameters?: ProviderParameterType): DecoratorFunctionType => Decorator.apply(Provider, parameters);
