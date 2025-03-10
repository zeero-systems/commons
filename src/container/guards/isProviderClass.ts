import { ProviderClassType } from '~/container/types.ts';

export const isProviderClass = (x: any): x is ProviderClassType => {
  return x && x.name && !x.value;
};

export default isProviderClass;
