import type { ArtifactType, KeyType, TagType } from '~/common/types.ts';

export class Artifactor {
  static artifacts: Map<KeyType, ArtifactType> = new Map();

  static has(key: KeyType): boolean {
    return Artifactor.artifacts.has(key);
  }

  static set(key: KeyType, artifact: ArtifactType): Map<KeyType, ArtifactType & { tag?: TagType }> {
    return Artifactor.artifacts.set(key, artifact);
  }
}

export default Artifactor;
