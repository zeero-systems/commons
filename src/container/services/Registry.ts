import type { KeyType, TagType } from '~/container/types.ts';
import type { ContainerInterface } from '~/container/interfaces.ts';
import type { ArtifactType } from '~/common/types.ts';

import Locator from '~/container/services/Locator.ts';
import Container from '~/container/services/Container.ts';

export class Registry {
  static artifacts: Map<KeyType, ArtifactType & { tag?: TagType }> = new Map();

  static has(key: KeyType): boolean {
    return Registry.artifacts.has(key);
  }

  static set(key: KeyType, artifact: ArtifactType & { tag?: TagType }): Map<KeyType, ArtifactType & { tag?: TagType }> {
    return Registry.artifacts.set(key, artifact);
  }

  static create(key: KeyType): ContainerInterface {
    return Locator.containers.set(key, new Container()).get(key) as ContainerInterface;
  }
}

export default Registry;
