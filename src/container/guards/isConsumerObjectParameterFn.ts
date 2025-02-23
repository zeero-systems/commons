
import { ConsumerObjectParameterType } from '~/container/types.ts';

import isObjectFn from '~/common/guards/isObjectFn.ts';

export const isConsumerObjectParameterFn = (x: any): x is ConsumerObjectParameterType => {
  return x && isObjectFn(x)
};

export default isConsumerObjectParameterFn