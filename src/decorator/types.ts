import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { ArtifactType, ConstructorType, MetadataType, PropertiesType } from '~/common/types.ts';

/**
 * The returned decorator function
 * 
 * @type DecoratorFunctionType
 */ 
export type DecoratorFunctionType = (
  target: any,
  context: TargetContextType,
) => any;


/**
 * Extended decorator context with metadata
 * 
 * @type TargetContextType
 */ 
export type TargetContextType = DecoratorContext & {
  kind: string;
  name: string | symbol | undefined;
  static?: boolean;
  private?: boolean;
  access?: { get?: (object: any) => any, set?: (object: any, value: any) => void };
  addInitializer(initializer: () => void): void;
  metadata: MetadataType<any>;
};

export type AnnotationType = {
  name: string;
  target: AnnotationInterface & { constructor: { name: string, metadata?: symbol } };
  parameterNames?: Array<string>;
}

/**
 * Decoration type with metadata context
 * 
 * @type DecorationType
 */ 
export type DecorationType = {
  kind: 'class' | 'method' | 'getter' | 'setter' | 'field' | 'accessor';
  property: string | symbol;
  static?: boolean;
  private?: boolean;
  context: TargetContextType;
};

export type DecoratorType = {
  annotation: AnnotationType;
  decoration: DecorationType;
}

export type OnEvaluationType = <T>(target: T, parameters?: any ) => void
export type OnDecorationType = (artifact: ArtifactType, annotation: AnnotationType, decoration: DecorationType) => any

export type DecoratorEventType = { onEvaluation: Array<OnEvaluationType>, onDecoration: Array<OnDecorationType> }

export type UseType<T> = {
   annotation: ConstructorType<T>, 
   parameters?: PropertiesType<T> | Parameters<T extends (...args: any) => T ? T : never>
}


export default {};
