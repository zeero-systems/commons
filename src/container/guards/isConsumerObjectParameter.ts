
import { ConsumerObjectParameterType } from '~/container/types.ts';

import isObject from '~/common/guards/isObject.ts';

export const isConsumerObjectParameter = (x: any): x is ConsumerObjectParameterType => {
  return x && isObject(x)
};

export default isConsumerObjectParameter