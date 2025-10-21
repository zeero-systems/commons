import type { ArtifactType, NewableType, PropertyType } from '~/common/types.ts';
import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type {
  DecorationType,
  TargetContextType,
  DecoratorFunctionType,
  AnnotationType,
  DecoratorType,
  OnEvaluationType,
  OnDecorationType,
  DecoratorEventType,
  DecorationFunctionType,
} from '~/decorator/types.ts';

import DecoratorKindEnum from '~/decorator/enums/decorator-kind.enum.ts';

import Factory from '~/common/services/factory.service.ts';
import Objector from '~/common/services/objector.service.ts';

export class Decorator {
  public static readonly metadata: unique symbol = Symbol('Decorator.medadata');
  
  public static onEvents: DecoratorEventType = {
    onEvaluation: new Array<OnEvaluationType>,
    onDecoration: new Array<OnDecorationType>(Decorator.attach)
  }
  
  public static create<C extends NewableType<C>>(annotation: C): DecorationFunctionType<C> {
    return (...parameters: ConstructorParameters<C>) => {
      return Decorator.use(annotation as any, parameters)
    }
  }

  public static use<T extends NewableType<T>>(
    annotationTarget: T, 
    annotationParameters?: ConstructorParameters<T>,
  ): DecoratorFunctionType {

    for (let index = 0; index < Decorator.onEvents.onEvaluation.length; index++) {
      Decorator.onEvents.onEvaluation[index](annotationTarget, annotationParameters)
    }

    return function (
      decorationTarget: any,
      decorationContext: TargetContextType,
    ) {
      const artifactName = decorationTarget?.name || decorationTarget?.constructor?.name || decorationContext.name || ''
      const annotationInstance = Factory.arguments(annotationTarget, annotationParameters)
      
      const annotation: AnnotationType = {
        name: annotationTarget.name,
        target: annotationInstance as AnnotationInterface,
      } 

      const artifact: ArtifactType = {
        name: artifactName,
        target: decorationTarget, 
      };

      const decoration: DecorationType = {
        context: decorationContext,
        kind: decorationContext.kind,
        private: decorationContext.private,
        property: decorationContext.kind != DecoratorKindEnum.CLASS ? decorationContext.name : 'construct',
        static: decorationContext.static,
      };  

      if (decoration.context.metadata) {
        for (let index = 0; index < Decorator.onEvents.onDecoration.length; index++) {
          Decorator.onEvents.onDecoration[index](artifact, annotation, decoration)
        }
      }

      if (annotation.target.onInitialize) {
        decoration.context.addInitializer(function () {
          if (annotation.target.onInitialize) {
            return annotation.target.onInitialize({ ...artifact, target: this }, { annotation, decoration });
          }

          return undefined;
        });
      }

      if (annotation.target.onAttach) {
        return annotation.target.onAttach(artifact, { annotation, decoration }) ?? undefined;
      }
    };
  }

  public static attach(_artifact: ArtifactType, annotation: AnnotationType, decoration: DecorationType): any {
    if (annotation.target.persists === false) return

    const property = decoration.context.kind != DecoratorKindEnum.CLASS ? decoration.context.name : 'construct';
    
    if (!decoration.context.metadata[Decorator.metadata]) {
      decoration.context.metadata[Decorator.metadata] = new Map<PropertyType, DecoratorType[]>();
    }

    if (!decoration.context.metadata[Decorator.metadata].has(property)) {
      decoration.context.metadata[Decorator.metadata].set(property, new Array<DecoratorType>());
    }

    const stackable = annotation.target.stackable === undefined ? true : annotation.target.stackable;
    const decorations = decoration.context.metadata[Decorator.metadata].get(property) as Array<DecoratorType>;
    const alreadyExists = decorations.some((decorator: DecoratorType) => {
      return decorator.annotation.target.constructor.name === annotation.target.constructor.name;
    });

    if (stackable || !alreadyExists) {
      decorations.push({ annotation, decoration: Objector.deleteProperties(decoration, ['context']) });
    }
  }

  public static onEvaluation(callback: OnEvaluationType) {
    Decorator.onEvents.onEvaluation.push(callback)
  }

  public static onDecoration(callback: OnDecorationType) {
    Decorator.onEvents.onDecoration.push(callback)
  }  
}

export default Decorator;
