import type { ArtifactType, KeyType, TagType } from '~/common/types.ts';
import type { ArtifactorInterface } from '~/common/interfaces.ts';

export class Artifactor implements ArtifactorInterface {
  public artifacts: Map<TagType, Map<KeyType, ArtifactType>> = new Map();

  public hasTag(tag: TagType): boolean {
    return this.artifacts.has(tag)
  }

  public hasKey(key: KeyType): boolean {
    return !!this.artifacts.values().find((k) => k.has(key))
  }

  public has(tag: TagType, key: KeyType): boolean {
    return !!this.artifacts.get(tag)?.has(key)
  }

  public set(tags: TagType | Array<TagType>, key: KeyType, artifact: ArtifactType): ArtifactType {
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
  
  public get(tag: TagType, key: KeyType): ArtifactType | undefined {
    return this.artifacts.get(tag)?.get(key)
  }

  public getByKey(key: KeyType): ArtifactType | undefined {
    return this.artifacts.values().find((k) => k.has(key))?.get(key)
  }

  public getByTag(tag: TagType): Map<KeyType, ArtifactType> | undefined {
    return this.artifacts.get(tag)
  }

  public size(): number {
    return this.artifacts.values().reduce((acc: number, cur: Map<KeyType, ArtifactType>) => acc + cur.size, 0) 
  }
  public sizeByTag(tag: TagType): number {
    return this.getByTag(tag)?.size || 0
  }
}

export default Artifactor;
