import { MetadataType } from '~/decorator/types.ts';

export type ProviderClassType = new (...args: any) => any & MetadataType<any, any>;

export type ProviderPlainType = {
  name: string;
  value: any;
};

export type ConsumerParameterType =
  | string
  | (new (...args: any[]) => any)
  | ConsumerObjectParameterType;

export type ConsumerObjectParameterType = {
  [key: string | symbol]: { optional?: boolean }
};

export type ProviderType = ProviderClassType | ProviderPlainType;
