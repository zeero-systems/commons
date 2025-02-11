import ProviderClassType from 'packages/provider/types/ProviderClassType.ts';
import ProviderPlainType from 'packages/provider/types/ProviderPlainType.ts';

export type ModuleType = {
  providers: Array<ProviderPlainType | ProviderClassType>
}
export default ModuleType
