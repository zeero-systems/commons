import type { ArtifactType, KeyType } from '~/common/types.ts';

export class Artifactor {
  static artifacts: Map<KeyType, ArtifactType> = new Map();

  static has(key: KeyType): boolean {
    return Artifactor.artifacts.has(key);
  }

  static set(key: KeyType, artifact: ArtifactType): Map<KeyType, ArtifactType> {
    const currentArtifact = Artifactor.artifacts.get(key)

    if (currentArtifact) {
      if (artifact.tags) {
        for (const tag of artifact.tags) {
          if (!currentArtifact.tags?.includes(tag)) {
            currentArtifact.tags?.push(tag)
          }
        }
      }
    } else {
      Artifactor.artifacts.set(key, artifact);
    }
        
    return Artifactor.artifacts
  }
}

export default Artifactor;
