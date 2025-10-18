import type { ContainerInterface } from '~/container/interfaces.ts';
import type { ArtifactType, KeyableType, NewableType } from '~/common/types.ts';
import type { UnpackType } from '~/packer/types.ts';

export interface PackInterface {  
  onBoot?(...args: any[]): void
  onStart?(...args: any[]): void
  onStop?(...args: any[]): void
}

export interface PackerInterface { 
  packs: Array<KeyableType>
  container: ContainerInterface

  artifacts(): Array<ArtifactType>
  unpack(pack: NewableType<new (...args: any[]) => PackInterface>): UnpackType
}