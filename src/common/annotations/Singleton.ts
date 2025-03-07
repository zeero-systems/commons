import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { ArtifactType, DecorationType, DecoratorFunctionType } from '~/decorator/types.ts';

import AnnotationException from '~/decorator/exceptions/AnnotationException.ts';
import Common from '~/common/services/Common.ts';
import Decorator from '~/decorator/services/Decorator.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';

export class Singleton implements AnnotationInterface {  
  onAttach<P>(artifact: ArtifactType, decoration: DecorationType<P>): any {

    if (decoration.kind == DecoratorKindEnum.CLASS) {
      artifact.target = new Proxy(artifact.target as any, {
        construct(currentTarget, currentArgs, newTarget) {
          if (currentTarget.prototype !== newTarget.prototype) {
            return Reflect.construct(currentTarget, currentArgs, newTarget);
          }

          if (!decoration.context.metadata[Common.singleton]) {
            decoration.context.metadata[Common.singleton] = Reflect.construct(currentTarget, currentArgs, newTarget);
          }

          return decoration.context.metadata[Common.singleton];
        },
      });

      artifact.target.toString = Function.prototype.toString.bind(artifact.target);

      return artifact.target;
    }

    throw new AnnotationException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: artifact.name, kind: decoration.kind },
    });
  }
}

export default (): DecoratorFunctionType => Decorator.apply(Singleton);
