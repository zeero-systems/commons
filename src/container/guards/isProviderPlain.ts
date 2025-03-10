import { ProviderPlainType } from '~/container/types.ts';

export const isProviderPlain = (x: any): x is ProviderPlainType => {
  return x && x.name && x.value;
};

export default isProviderPlain;
