import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { DecoratorType } from '~/decorator/types.ts';
import type { ArtifactType } from '~/common/types.ts';

import AnnotationException from '~/decorator/exceptions/annotation.exception.ts';
import DecoratorKindEnum from '~/decorator/enums/decorator-kind.enum.ts';

export class SingletonAnnotation implements AnnotationInterface {
  name: string = 'Singleton'
  public static readonly metadata: unique symbol = Symbol('Singleton.medadata');

  onAttach(artifact: ArtifactType, decorator: DecoratorType): any {
    if (decorator.decoration.kind == DecoratorKindEnum.CLASS) {
      if (!decorator.decoration.context.metadata[SingletonAnnotation.metadata]) {
        artifact.target = new Proxy(artifact.target as any, {
          construct(currentTarget, currentArgs, newTarget) {
            if (currentTarget.prototype !== newTarget.prototype) {
              return Reflect.construct(currentTarget, currentArgs, newTarget);
            }
            
            if (!decorator.decoration.context.metadata[SingletonAnnotation.metadata]) {
              decorator.decoration.context.metadata[SingletonAnnotation.metadata] = Reflect.construct(currentTarget, currentArgs, newTarget);
            }

            return decorator.decoration.context.metadata[SingletonAnnotation.metadata];
          },
        });
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

export default SingletonAnnotation
