import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { ArtifactType, MetadataType, TargetPropertyType } from '~/common/types.ts';

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
export type DecoratorSettingsType = {
  [key: string]: any
  persists?: boolean
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
  metadata: MetadataType<any>;
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
  parameters: P | undefined;
  options?: AnnotationOptionsType;
};

export type DecorationMetadataMapType<P> = Map<TargetPropertyType, DecorationMetadataType<P>[]>;

/**
 * Decoration type with metadata context
 * 
 * @type DecorationType
 */ 
export type DecorationType<P> = DecorationMetadataType<P> & {
  context: TargetContextType;
};

/**
 * Metadata applier function type
 * 
 * @type MetadataApplierType
 */ 
export type MetadataApplierType = <P>(artifact: ArtifactType, decoration: DecorationType<P>, settings: Partial<DecoratorSettingsType>) => void | any;

/**
 * Annotation options type
 * 
 * @type AnnotationOptionsType
 */ 
export type AnnotationOptionsType = {
  stackable?: boolean;
};

export default {};
