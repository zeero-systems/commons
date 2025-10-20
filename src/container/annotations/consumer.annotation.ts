import type { ArtifactType } from '~/common/types.ts';
import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { DecoratorType } from '~/decorator/types.ts';

import AnnotationException from '~/decorator/exceptions/annotation.exception.ts';
import DecoratorKindEnum from '~/decorator/enums/decorator-kind.enum.ts';
import ScopeEnum from '~/container/enums/scope.enum.ts';
import { ConsumerAnnotationInterface } from '../interfaces.ts';
import { Factory } from '@zeero-systems/commons/services';

export class ConsumerAnnotation implements AnnotationInterface, ConsumerAnnotationInterface {
  readonly name: string = 'Consumer'
  readonly stackable?: boolean | undefined = true;
  parameterNames?: string[] | undefined;
  
  static readonly metadata: unique symbol = Symbol('Consumer.metadata')

  constructor(public provider?: string, public propertyKey?: string, public options?: { scope?: ScopeEnum }) {}

  onAttach(artifact: ArtifactType, decorator: DecoratorType): any {
    if (
      decorator.decoration.kind == DecoratorKindEnum.CLASS ||
      decorator.decoration.kind == DecoratorKindEnum.METHOD ||
      decorator.decoration.kind == DecoratorKindEnum.ACCESSOR ||
      decorator.decoration.kind == DecoratorKindEnum.FIELD
    ) {

      if (decorator.decoration.kind == DecoratorKindEnum.CLASS) {
        this.parameterNames = Factory.getParameterNames(artifact.target, 'constructor')
      }

      if (decorator.decoration.kind == DecoratorKindEnum.METHOD) {
        this.parameterNames = Factory.getParameterNames(artifact.target, String(decorator.decoration.property))
      }

      return artifact.target;
    }

    throw new AnnotationException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: artifact.name, kind: decorator.decoration.kind },
    });
  }

  onInitialize(_artifact: ArtifactType, _decorator: DecoratorType) { }
}

export default ConsumerAnnotation