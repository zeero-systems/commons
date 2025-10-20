import type { ArtifactType, NewableType } from '~/common/types.ts';
import type { DecoratorType, DecorationType } from '~/decorator/types.ts';
import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { ConsumerType, ProviderType } from '~/container/types.ts';
import type { PackInterface } from '~/packer/interfaces.ts';

import DecoratorKindEnum from '~/decorator/enums/decorator-kind.enum.ts';
import AnnotationException from '~/decorator/exceptions/annotation.exception.ts';
import Decorator from '~/decorator/services/decorator.service.ts';
import ConsumerAnnotation from '~/container/annotations/consumer.annotation.ts';

export class PackAnnotation implements AnnotationInterface {
  readonly name: string = 'Pack'

  static artifacts: Array<ArtifactType> = []
  static readonly metadata: unique symbol = Symbol('Pack.metadata')

  constructor(
    public options: {
      providers?: Array<ProviderType | NewableType<any>>,
      consumers?: Array<ConsumerType | NewableType<any>>,
      packs?: Array<NewableType<new (...args: any[]) => PackInterface>>,
    } = {}
  ) { }

  onAttach(artifact: ArtifactType, decorator: DecoratorType): any {
    if (decorator.decoration.kind == DecoratorKindEnum.CLASS) {
      Decorator.attach(artifact, { name: 'ConsumerAnnotation', target: new ConsumerAnnotation() }, decorator.decoration)
      
      const methodNames = ['onBoot', 'onStart', 'onStop']

      for (const methodName of methodNames) {
        if (artifact.target.prototype[methodName]) {
          const onBootDecoration: DecorationType = { 
            ...decorator.decoration, 
            kind: 'method', 
            property: methodName, 
            context: { 
              ...decorator.decoration.context, 
              name: methodName, 
              kind: 'method' 
            } as any 
          }
          Decorator.attach(artifact, { name: 'ConsumerAnnotation', target: new ConsumerAnnotation() }, onBootDecoration)
        }
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

export default PackAnnotation