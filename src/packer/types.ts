import { ConsumerType, ProviderType } from '~/container/types.ts';
import { NewableType } from '~/common/types.ts';
import { PackInterface } from '~/packer/interfaces.ts';

export type UnpackType = { 
  providers: Array<ProviderType>
  consumers: Array<ConsumerType>
}

export type PackNewableType = NewableType<new (...args: any[]) => PackInterface>

export default {}
