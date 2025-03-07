
import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { ComponentParametersType } from '~/container/types.ts';
import type { DecorationType, ArtifactType, DecoratorFunctionType } from '~/decorator/types.ts';

import AnnotationException from '~/decorator/exceptions/AnnotationException.ts';
import Component from '~/container/annotations/Component.ts';
import Consumer from '~/container/annotations/Consumer.ts';
import Decorator from '~/decorator/services/Decorator.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import Mixin from '~/common/annotations/Mixin.ts';
import Provider from '~/container/annotations/Provider.ts';
import Singleton from '~/common/annotations/Singleton.ts';

export class Module implements AnnotationInterface {
  onAttach<P>(artifact: ArtifactType, decoration: DecorationType<P & ComponentParametersType>) {
    if (decoration.kind == DecoratorKindEnum.CLASS) {
      return Mixin([Consumer(), Provider(), Component(decoration.parameters), Singleton() ])(artifact.target, decoration.context)
    }

    throw new AnnotationException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: artifact.name, kind: decoration.kind },
    });
  }
}

export default (parameters?: ComponentParametersType): DecoratorFunctionType => Decorator.apply(Module, parameters);
