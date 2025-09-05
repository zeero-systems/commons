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

  public has(key: KeyType, tag: TagType): boolean {
    return !!this.artifacts.get(tag)?.has(key)
  }

  public set(key: KeyType, artifact: ArtifactType): ArtifactType {
    const metadataKeys = Array.isArray(artifact.metadataKeys) ? artifact.metadataKeys : []

    for (let index = 0; index < metadataKeys.length; index++) {
      const metadataKey = metadataKeys[index];
      
      if (!this.hasTag(metadataKey)) {
        this.artifacts.set(metadataKey, new Map())
      }

      this.artifacts.get(metadataKey)?.set(key, artifact)
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

  public get size(): number {
    return this.artifacts.values().reduce((acc: number, cur: Map<KeyType, ArtifactType>) => acc + cur.size, 0) 
  }

  public get sizeByTag(): { [key: string | symbol]: number } {
    return this.artifacts.entries().reduce((result, [tag, artifacts]) => {
      result[tag] = artifacts.size
      
      return result
    }, {} as { [key: string | symbol]: number })
  }
}

export default Artifactor;
