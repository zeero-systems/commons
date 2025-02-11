import { MetadataType } from '~/decorator/types.ts';

export type ProviderClassType = new (...args: any) => any & MetadataType<any, any>

export type ProviderPlainType = {
  name: string
  value: any
}

export type ProviderType = ProviderClassType | ProviderPlainType