import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { MetadataType } from '~/common/types.ts';

/**
 * The returned decorator function
 * 
 * @type DecoratorFunctionType
 */ 
export type DecoratorFunctionType = (
  target: any,
  context: TargetContextType,
  options?: AnnotationOptionsType,
) => any;

/**
 * Settings to control how to apply a decoration
 * 
 * @type DecDecoratorSettingsType<P>
 */ 
export type DecoratorSettingsType<P> = {
  persists: boolean
  parameters?: P
  [key: string]: any
}

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
  metadata: MetadataType;
};

/**
 * Decoration metadata type
 * 
 * @type DecorationMetadataType
 */ 
export type DecorationMetadataType<P> = Pick<TargetContextType, 'static' | 'private'> & {
  kind: 'class' | 'method' | 'getter' | 'setter' | 'field' | 'accessor';
  annotation: AnnotationInterface;
  property: string | symbol;
  settings: DecoratorSettingsType<P>;
  options?: AnnotationOptionsType;
};

/**
 * Decoration type with metadata context
 * 
 * @type DecorationType
 */ 
export type DecorationType<P> = DecorationMetadataType<P> & {
  context: TargetContextType;
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
