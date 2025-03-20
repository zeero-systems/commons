import type { ArtifactType, ConstructorType, TargetPropertyType } from '~/common/types.ts';
import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type {
  AnnotationOptionsType,
  DecorationMetadataType,
  DecorationType,
  DecoratorContextType,
  DecoratorFunctionType,
} from '~/decorator/types.ts';

import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';

import Factory from '~/common/services/Factory.ts';
import Objector from '~/common/services/Objector.ts';
import Mixin from '~/common/annotations/Mixin.ts';
import Metadata from '~/common/services/Metadata.ts';
import Common from '~/common/services/Common.ts';

export class Decorator {
  public static readonly metadata: unique symbol = Symbol('Decorator.medadata');

  public static apply<T extends AnnotationInterface, P>(
    annotation: ConstructorType<T>,
    parameters?: P,
  ): DecoratorFunctionType {
    return function (
      target: any,
      context: DecoratorContextType,
      options?: AnnotationOptionsType,
    ) {
      
      const artifactName = target?.name || target?.constructor?.name || ''
      const artifactParameterName = context.kind != DecoratorKindEnum.CLASS ? context.name : 'constructor';

      const artifact: ArtifactType = {
        name: artifactName,
        target: target,
        parameters: target ? Factory.getParameterNames(target, String(artifactParameterName)) : [],
      };

      const decoration: DecorationType<P> = {
        kind: context.kind,
        annotation: Reflect.construct(annotation, []),
        parameters: undefined,
        property: context.kind != DecoratorKindEnum.CLASS ? context.name : 'construct',
        context,
      };

      if (options) decoration.options = options;
      if (parameters) decoration.parameters = parameters;
      if (context.static) decoration.static = context.static;
      if (context.private) decoration.private = context.private;
      
      if (decoration.context.metadata) {
        if (decoration.annotation.constructor.name != Mixin.name) {
          Decorator.applyMetadata(decoration);
        }

        Common.applyMetadata(artifact, decoration)
      }

      if (decoration.annotation.onInitialize) {
        Decorator.applyInitializer(artifact, decoration);
      }

      if (decoration.annotation.onAttach) {
        return decoration.annotation.onAttach<P>(artifact, decoration) ?? undefined;
      }
    };
  }

  public static hasAnnotation<T extends {}>(
    target: T,
    annotation: ConstructorType<AnnotationInterface>,
    propertyKey: PropertyKey = 'construct',
  ): boolean {
    const metadata = Metadata.getProperty(target, Decorator.metadata);

    return metadata && metadata.get(propertyKey)?.some((decorator: DecorationMetadataType<any>) => {
      return decorator.annotation.constructor.name == annotation.name;
    });
  }

  public static getDecoration<T extends {}>(
    target: T,
    annotation: ConstructorType<AnnotationInterface>,
    propertyKey: PropertyKey = 'construct',
  ): DecorationMetadataType<any> | undefined {
    const metadata = Metadata.getProperty(target, Decorator.metadata);

    return metadata && metadata.get(propertyKey)?.find((decorator: DecorationMetadataType<any>) => {
      return decorator.annotation.constructor.name == annotation.name;
    });
  }

  private static applyMetadata<P>(decoration: DecorationType<P>): void {
    const property = decoration.context.kind != DecoratorKindEnum.CLASS ? decoration.context.name : 'construct';

    if (!decoration.context.metadata[Decorator.metadata]) {
      decoration.context.metadata[Decorator.metadata] = new Map<TargetPropertyType, DecorationMetadataType<P>[]>();
    }

    if (!decoration.context.metadata[Decorator.metadata].has(property)) {
      decoration.context.metadata[Decorator.metadata].set(property, new Array<DecorationMetadataType<P>>());
    }

    const stackable = decoration.options?.stackable === undefined ? true : decoration.options?.stackable;
    const decorations = decoration.context.metadata[Decorator.metadata].get(property);
    const alreadyExists = !decorations.some((d: DecorationMetadataType<P>) => {
      // @ts-ignore annotation always have a name
      return d.annotation.name === decoration.annotation.name;
    });

    if (stackable || !alreadyExists) {
      decorations.push(Objector.deleteProperties(decoration, ['context']));
    }
  }

  private static applyInitializer<P>(artifact: ArtifactType, decoration: DecorationType<P>): void {
    decoration.context.addInitializer(function () {
      if (decoration.annotation.onInitialize) {
        return decoration.annotation.onInitialize<P>({ ...artifact, target: this }, decoration);
      }

      return undefined;
    });
  }
}

export default Decorator;
