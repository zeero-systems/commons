import type { OmitType, TargetPropertyType } from '~/common/types.ts';
import type { DecorationType } from '~/decorator/types.ts';

import ArrayMap from '~/structure/services/ArrayMap.ts';

export const isDecoratorMetadataFn = (x: any): x is ArrayMap<TargetPropertyType, DecorationType<any>> => {
  return typeof x !== 'undefined' && typeof x === 'object'
};

export default isDecoratorMetadataFn;
