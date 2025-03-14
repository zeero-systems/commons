import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { MetadataType } from '~/common/types.ts';

/**
 * Defines the decorator artifact type
 * 
 * @type ArtifactType
 */ 
export type ArtifactType = {
  name: string;
  target: any;
  parameters: string[];
};

/**
 * The returned decorator function
 * 
 * @type DecoratorFunctionType
 */ 
export type DecoratorFunctionType = (
  target: any,
  context: DecoratorContextType,
  options?: AnnotationOptionsType,
) => any;

/**
 * Extended decorator context with metadata
 * 
 * @type DecoratorContextType
 */ 
export type DecoratorContextType = DecoratorContext & {
  kind: string;
  name: string | symbol | undefined;
  static?: boolean;
  private?: boolean;
  access?: { get?: (object: any) => any, set?: (object: any, value: any) => void };
  addInitializer(initializer: () => void): void;
  metadata: MetadataType;
};

/**
 * Decoration metadata type
 * 
 * @type DecorationMetadataType
 */ 
export type DecorationMetadataType<P> = Pick<DecoratorContextType, 'static' | 'private'> & {
  kind: 'class' | 'method' | 'getter' | 'setter' | 'field' | 'accessor';
  annotation: AnnotationInterface;
  options?: AnnotationOptionsType;
  parameters: P | undefined;
};

/**
 * Decoration type with metadata context
 * 
 * @type DecorationType
 */ 
export type DecorationType<P> = DecorationMetadataType<P> & {
  context: DecoratorContextType;
};

/**
 * Annotation options type
 * 
 * @type AnnotationOptionsType
 */ 
export type AnnotationOptionsType = {
  stackable?: boolean;
};

export default {};
