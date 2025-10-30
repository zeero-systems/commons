import type { ContainerInterface } from '~/container/interfaces.ts';
import type { ArtifactType, KeyableType } from '~/common/types.ts';
import type { PackNewableType } from '~/packer/types.ts';
import type { DispatcherInterface } from '~/emitter/interfaces.ts';

export interface PackInterface {  
  onBoot?(...args: any[]): Promise<void>
  onStart?(...args: any[]): Promise<void>
  onStop?(...args: any[]): Promise<void>
}

export interface PackerInterface { 
  packs: Array<KeyableType>
  container: ContainerInterface
  dispatcher: DispatcherInterface<{ unpacked: [PackNewableType] }>

  artifacts(): Array<ArtifactType>
  unpack(pack: PackNewableType): void
  
  [Symbol.dispose](): void;
}