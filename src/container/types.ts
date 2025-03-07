import { ConstructorType } from '~/common/types.ts';

/**
 * Defines a consumer type
 *
 * @type ConsumerParameterType
 */
export type ConsumerParameterType =
  | string
  | (new (...args: any[]) => any)
  | ConsumerObjectParameterType;

/**
 * Defines a consumer object type
 *
 * @type ConsumerObjectParameterType
 */
export type ConsumerObjectParameterType = {
  [key: string | symbol]: { optional?: boolean };
};

/**
 * Defines a provider class type as the same as a constructor class
 *
 * @type ProviderClassType
 */
export type ProviderClassType = ConstructorType<any>

/**
 * Defines a provider plain type
 *
 * @type ProviderPlainType
 */
export type ProviderPlainType = {
  name: string;
  value: any;
};

/**
 * Defines a provider type
 *
 * @type ProviderType
 */
export type ProviderType = ProviderClassType | ProviderPlainType;

/**
 * Defines a provider parameters type
 *
 * @type ProviderType
 */
export type ProviderParameterType = {
  propertyDecorator: {
    enumerable: true;
    configurable: true;
  };
};

/**
 * Defines a module class type
 *
 * @type ModuleClassType
 */
export type ModuleClassType = new (...args: any) => any

/**
 * Defines a component parameters type
 *
 * @type ComponentParametersType
 */
export type ComponentParametersType = {
  providers?: Array<ProviderType>
  consumers?: Array<ConstructorType<any>>
}

/**
 * Defines a module type
 *
 * @type ModuleType
 */
export type ModuleType = ModuleClassType


export default {};