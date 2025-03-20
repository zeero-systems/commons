import type { ArtifactType, KeyType, TagType } from '~/common/types.ts';

import ScopeEnum from '~/container/enums/ScopeEnum.ts';

export interface ContainerInterface {
  artifacts: Map<KeyType, ArtifactType>
  artifactsByTag: Map<TagType, Map<KeyType, ArtifactType>>
  instances: Map<KeyType, any>

  construct<T>(key: KeyType, scope?: ScopeEnum): T | undefined;
}

export default {}