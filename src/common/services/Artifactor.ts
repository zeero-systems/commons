import type { ArtifactType, KeyType, MetaTagType } from '~/common/types.ts';
import type { ArtifactorInterface } from '~/common/interfaces.ts';

export class Artifactor implements ArtifactorInterface {
  public artifacts: Map<MetaTagType, Map<KeyType, ArtifactType>> = new Map();

  public hasTag(tag: MetaTagType): boolean {
    return this.artifacts.has(tag)
  }

  public hasKey(key: KeyType): boolean {
    return !!this.artifacts.values().find((k) => k.has(key))
  }

  public has(tag: MetaTagType, key: KeyType): boolean {
    return !!this.artifacts.get(tag)?.has(key)
  }

  public set(tags: MetaTagType | Array<MetaTagType>, key: KeyType, artifact: ArtifactType): ArtifactType {
    const currentTags = Array.isArray(tags) ? tags : [tags]

    for (let index = 0; index < currentTags.length; index++) {
      const currentTag = currentTags[index];
      
      if (!this.hasTag(currentTag)) {
        this.artifacts.set(currentTag, new Map())
      }

      this.artifacts.get(currentTag)?.set(key, artifact)
    }

    return artifact
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

  public size(): number {
    return this.artifacts.values().reduce((acc: number, cur: Map<KeyType, ArtifactType>) => acc + cur.size, 0) 
  }
  public sizeByTag(tag: MetaTagType): number {
    return this.getByTag(tag)?.size || 0
  }
}

export default Artifactor;
