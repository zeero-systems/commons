import type { DecorationType, ArtifactType } from '~/decorator/types.ts';

export interface AnnotationInterface {  
  onAttach?<P>(artifact: ArtifactType, decoration: DecorationType<P>): any;
  onInitialize?<P>(artifact: ArtifactType, decoration: DecorationType<P>): any;
}
