import type { ArtifactType, KeyType, TagType } from '~/common/types.ts';
import Artifactor from '~/common/services/Artifactor.ts';

export class Artifactory {
  static artifactor = new Artifactor()

  static hasTag(tag: TagType): boolean {
    return Artifactory.artifactor.hasTag(tag)
  }

  static hasKey(tag: TagType, key: KeyType): boolean {
    return !!Artifactory.artifactor.hasKey(tag, key)
  }

  static has(tag: KeyType, key: KeyType): boolean {
    return Artifactory.has(tag, key)
  }

  static set(tags: TagType | Array<TagType>, key: KeyType, artifact: ArtifactType): ArtifactType {
    return Artifactory.artifactor.set(tags, key, artifact)
  }
  
  static get(tag: TagType, key: KeyType): ArtifactType | undefined {
    return Artifactory.artifactor.get(tag, key)
  }

  static getByKey(key: KeyType): ArtifactType | undefined {
    return Artifactory.artifactor.getByKey(key)
  }

  static getByTag(tag: TagType): Map<KeyType, ArtifactType> | undefined {
    return Artifactory.artifactor.getByTag(tag)
  }
}

export default Artifactory;
