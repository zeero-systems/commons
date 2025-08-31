import type { ArtifactType, KeyType, MetaTagType } from '~/common/types.ts';

export class Artifactor {
  public artifacts: Map<MetaTagType, Map<KeyType, ArtifactType>> = new Map();

  public hasTag(tag: MetaTagType): boolean {
    return this.artifacts.has(tag)
  }

  public hasKey(tag: MetaTagType, key: KeyType): boolean {
    return !!this.artifacts.get(tag)?.has(key)
  }

  public has(tag: KeyType, key: KeyType): boolean {
    return this.hasKey(tag, key)
  }

  public set(tags: MetaTagType | Array<MetaTagType>, key: KeyType, artifact: ArtifactType): ArtifactType {
    if (!Array.isArray(tags)) tags = [tags] 
    
    for (const tag in tags) {
      if (!this.hasTag(tag)) {
        this.artifacts.set(tag, new Map())
      }
  
      this.artifacts.get(tag)?.set(key, artifact)
    }

    return this.artifacts.get(tags[0])?.get(key) || artifact
  }
  
  public get(tag: MetaTagType, key: KeyType): ArtifactType | undefined {
    return this.artifacts.get(tag)?.get(key)
  }

  public getByKey(key: KeyType): ArtifactType | undefined {
    return this.artifacts.values().find((k) => k.has(key))?.get(key)
  }

  public getByTag(tag: MetaTagType): Map<KeyType, ArtifactType> | undefined {
    return this.artifacts.get(tag)
  }
}

export default Artifactor;
