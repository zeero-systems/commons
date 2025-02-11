import { ProviderClassType } from '~/provider/types.ts';

export const guardProviderClassFn = (x: any): x is ProviderClassType => {
  return x && x.name && !x.value;
};

export default guardProviderClassFn;
