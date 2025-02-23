import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { MetadataType } from '~/common/types.ts';

export type ArtifactType = {
  name: string;
  target: any;
  parameters: string[];
};

export type DecoratorFunctionType = (
  target: any,
  context: DecoratorContextType,
  options?: AnnotationOptionsType,
) => any;

export type DecoratorContextType = DecoratorContext & {
  kind: string;
  name: string | symbol | undefined;
  static?: boolean;
  private?: boolean;
  access?: { get?: (object: any) => any, set?: (object: any, value: any) => void };
  addInitializer(initializer: () => void): void;
  metadata: MetadataType;
};

export type DecorationMetadataType<P> = {
  kind: 'class' | 'method' | 'getter' | 'setter' | 'field' | 'accessor';
  static?: boolean;
  private?: boolean;
  annotation: AnnotationInterface;
  options?: AnnotationOptionsType;
  parameters?: P;
};

export type DecorationType<P> = DecorationMetadataType<P> & {
  context: DecoratorContextType;
};

export type AnnotationOptionsType = {
  stackable?: boolean;
};

export default {};
