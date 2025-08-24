import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorFunctionType } from '~/decorator/types.ts';
import type { ArtifactType } from '~/common/types.ts';

import AnnotationException from '~/decorator/exceptions/AnnotationException.ts';
import Decorator from '~/decorator/services/Decorator.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';

export class Singleton implements AnnotationInterface {
  public static readonly metadata: unique symbol = Symbol('Singleton.medadata');

  onAttach<P>(artifact: ArtifactType, decoration: DecorationType<P>): any {
    if (decoration.kind == DecoratorKindEnum.CLASS) {
      if (!Decorator.hasAnnotation(artifact.target, Singleton)) {
        artifact.target = new Proxy(artifact.target as any, {
          construct(currentTarget, currentArgs, newTarget) {
            if (currentTarget.prototype !== newTarget.prototype) {
              return Reflect.construct(currentTarget, currentArgs, newTarget);
            }
            
            if (!decoration.context.metadata[Singleton.metadata]) {
              decoration.context.metadata[Singleton.metadata] = Reflect.construct(currentTarget, currentArgs, newTarget);
            }

            return decoration.context.metadata[Singleton.metadata];
          },
        });
      }

      return artifact.target;
    }

    throw new AnnotationException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: artifact.name, kind: decoration.kind },
    });
  }
}

export default (): DecoratorFunctionType => Decorator.apply(Singleton);
