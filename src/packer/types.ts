import { ConsumerType, ProviderType } from '~/container/types.ts';

export type UnpackType = { 
  providers: Array<ProviderType>
  consumers: Array<ConsumerType>
}

export default {}
