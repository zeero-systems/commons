import { ConstructorType } from '~/common/types.ts';

export type ProviderClassType = new (...args: any) => any;

export type ProviderPlainType = {
  name: string;
  value: any;
};

export type ConsumerParameterType =
  | string
  | (new (...args: any[]) => any)
  | ConsumerObjectParameterType;

export type ConsumerObjectParameterType = {
  [key: string | symbol]: { optional?: boolean };
};

export type ProviderType = ProviderClassType | ProviderPlainType;

export type ProviderParameterType = {
  propertyDecorator: {
    enumerable: true;
    configurable: true;
  };
};

export type ModuleClassType = new (...args: any) => any

export type ComponentParametersType = {
  providers?: Array<ProviderType>
  consumers?: Array<ConstructorType<any>>
}

export type ModuleType = ModuleClassType


export default {};