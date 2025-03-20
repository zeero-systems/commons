import { ArtifactType } from '~/common/types.ts';
import { DecorationType } from '~/decorator/types.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import Metadata from '~/common/services/Metadata.ts';

/**
 * Simple class to hold parameter symbol
 */
export class Parameter {
  public static readonly metadata: unique symbol = Symbol('Parameter.metadata');

  public static applyMetadata<P>(artifact: ArtifactType, decoration: DecorationType<P>): void {
    if (decoration.property) {
      if (!decoration.context.metadata[Parameter.metadata]) {
        decoration.context.metadata[Parameter.metadata] = new Map();
      }

      if (!decoration.context.metadata[Parameter.metadata].has(decoration.property)) {
        if (decoration.context.kind == DecoratorKindEnum.CLASS) {
          decoration.context.metadata[Parameter.metadata].set(decoration.property, artifact.parameters);
        }
      }
    }
  }

  public static get(target: any, propertyKey: string = 'construct'): string[] {
    let parameters = []
    const metadata = Metadata.get(target)
    if (metadata) {
      const properties = metadata[Parameter.metadata]
      if (properties) {
        parameters = properties.get(propertyKey)
      }
    }

    return parameters
  }
}

export default Parameter;
