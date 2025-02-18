import { ProviderType } from '~/provider/types.ts';
import { ConstructorType } from '~/common/types.ts';

export type ModuleClassType = new (...args: any) => any

export type ComponentParametersType = {
  providers?: Array<ProviderType>
  consumers?: Array<ConstructorType<any>>
}

export type ModuleType = ModuleClassType

export default {};