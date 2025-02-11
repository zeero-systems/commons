import { ProviderPlainType } from '~/provider/types.ts';

export const guardProviderPlainFn = (x: any): x is ProviderPlainType => {
  return x && x.name && x.value;
};

export default guardProviderPlainFn;
