import type { ArtifactType, DecorationType } from '~/decorator/types.ts';

import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';

/**
 * Static Class that holds common symbols
 */ 
export class Common {
  public static readonly metadata: unique symbol = Symbol('Common.metadata')
  public static readonly singleton: unique symbol = Symbol('Common.singleton')

  public static applyMetadata<P>(artifact: ArtifactType, decoration: DecorationType<P>): void {
    if (decoration.property) {
      if (!decoration.context.metadata[Common.metadata]) {
        decoration.context.metadata[Common.metadata] = {}
      }

      if (!decoration.context.metadata[Common.metadata][decoration.property]) {
        decoration.context.metadata[Common.metadata][decoration.property] = {}
      }
      
      if (decoration.context.kind == DecoratorKindEnum.CLASS) {
        if (!decoration.context.metadata[Common.metadata][decoration.property].parameters) {
          decoration.context.metadata[Common.metadata][decoration.property].parameters = artifact.parameters
        }
      }
    }
  }
}

export default Common