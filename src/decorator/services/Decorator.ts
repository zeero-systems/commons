import type { ArtifactType, ConstructorType, TargetPropertyType } from '~/common/types.ts';
import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type {
  AnnotationOptionsType,
  DecorationMetadataType,
  DecorationType,
  TargetContextType,
  DecoratorFunctionType,
  DecoratorSettingsType,
  MetadataApplierType,
} from '~/decorator/types.ts';

import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';

import Factory from '~/common/services/Factory.ts';
import Objector from '~/common/services/Objector.ts';

export class Decorator {
  public static readonly keys: unique symbol = Symbol('Decorator.keys');
  public static readonly metadata: unique symbol = Symbol('Decorator.medadata');

  public static onMetadata: Array<MetadataApplierType> = [
    Decorator.applyMetadata,
  ];

  public static apply<T extends AnnotationInterface, P>(
    annotation: T,
    parameters: P | undefined = undefined,
    settings: DecoratorSettingsType = { persists: true }
  ): DecoratorFunctionType {
    return function (
      target: any,
      context: TargetContextType,
      options?: AnnotationOptionsType,
    ) {
      
      const artifactName = target?.name || target?.constructor?.name || ''
      const artifactParameterName = context.kind != DecoratorKindEnum.CLASS ? context.name : 'constructor';

      const artifact: ArtifactType = {
        name: artifactName,
        target: target, 
        metadataKeys: [],
        parameterNames: Factory.getParameterNames(target, String(artifactParameterName)),
      };

      const decoration: DecorationType<P> = {
        kind: context.kind,
        annotation: Reflect.construct(annotation as unknown as ConstructorType<T>, []),
        property: context.kind != DecoratorKindEnum.CLASS ? context.name : 'construct',
        parameters,
        context,
      };
      
      if (options) decoration.options = options;
      if (context.static) decoration.static = context.static;
      if (context.private) decoration.private = context.private;
      
      if (decoration.context.metadata) {
        for (let index = 0; index < Decorator.onMetadata.length; index++) {
          Decorator.onMetadata[index]<P>(artifact, decoration, settings)
        }
      }

      if (decoration.annotation.onInitialize) {
        Decorator.applyInitializer(artifact, decoration);
      }

      if (decoration.annotation.onAttach) {
        return decoration.annotation.onAttach<P>(artifact, decoration) ?? undefined;
      }
    };
  }

  private static applyMetadata<P>(artifact: ArtifactType, decoration: DecorationType<P>, settings: Partial<DecoratorSettingsType>): void {
    if (settings?.persists === false) return

    const metadata = decoration.annotation.constructor.metadata
    const property = decoration.context.kind != DecoratorKindEnum.CLASS ? decoration.context.name : 'construct';
    
    if (!decoration.context.metadata[Decorator.keys]) {
      decoration.context.metadata[Decorator.keys] = [];
    }

    if (!decoration.context.metadata[Decorator.keys].includes(metadata)) {
      decoration.context.metadata[Decorator.keys].push(metadata)
    }


    artifact.metadataKeys = decoration.context.metadata[Decorator.keys]

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
