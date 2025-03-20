import type { KeyType } from '~/container/types.ts';

import ScopeEnum from '~/container/enums/ScopeEnum.ts';

export interface ContainerInterface {
  construct(key: KeyType, scope: ScopeEnum): void;
}

export default {}