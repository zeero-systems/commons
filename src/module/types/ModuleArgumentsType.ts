import ProviderPlainType from 'packages/provider/types/ProviderPlainType.ts';
import ProviderClassType from 'packages/provider/types/ProviderClassType.ts';

export type ModuleArgumentsType = {
  providers: Array<ProviderPlainType | ProviderClassType>
}

export default ModuleArgumentsType