import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { DecoratorType } from '~/decorator/types.ts';
import type { ArtifactType } from '~/common/types.ts';

import AnnotationException from '~/decorator/exceptions/annotation.exception.ts';
import DecoratorKindEnum from '~/decorator/enums/decorator-kind.enum.ts';
import DecoratorMetadata from '~/decorator/services/decorator-metadata.service.ts';

export class Singleton implements AnnotationInterface {
  public static readonly metadata: unique symbol = Symbol('Singleton.medadata');

  onAttach(artifact: ArtifactType, decorator: DecoratorType): any {
    if (decorator.decoration.kind == DecoratorKindEnum.CLASS) {
      if (!DecoratorMetadata.has(artifact.target, ['construct'], ['singleton'])) {
        artifact.target = new Proxy(artifact.target as any, {
          construct(currentTarget, currentArgs, newTarget) {
            if (currentTarget.prototype !== newTarget.prototype) {
              return Reflect.construct(currentTarget, currentArgs, newTarget);
            }
            
            if (!decorator.decoration.context.metadata[Singleton.metadata]) {
              decorator.decoration.context.metadata[Singleton.metadata] = Reflect.construct(currentTarget, currentArgs, newTarget);
            }

            return decorator.decoration.context.metadata[Singleton.metadata];
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

export default Singleton
