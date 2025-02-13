
import { ConsumerObjectParameterType } from '~/provider/types.ts';

import guardObjectFn from '~/common/guards/guardObjectFn.ts';

export const guardConsumerObjectParameterFn = (x: any): x is ConsumerObjectParameterType => {
  return x && guardObjectFn(x)
};

export default guardConsumerObjectParameterFn