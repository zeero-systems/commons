// deno-lint-ignore-file no-this-alias
import type { ContainerInterface } from '~/container/interfaces.ts';
import type { KeyType, TagType } from '~/container/types.ts';
import type { ArtifactType } from '~/common/types.ts';

import Factory from '~/common/services/Factory.ts';
import isClass from '~/common/guards/isClass.ts';
import Registry from '~/container/services/Registry.ts';
import ScopeEnum from '~/container/enums/ScopeEnum.ts';
import Locator from '~/container/services/Locator.ts';

export class Container implements ContainerInterface {
  public artifacts: Map<KeyType, ArtifactType & { tag?: TagType }> = new Map();
  public artifactsByTag: Map<TagType, Map<KeyType, ArtifactType & { tag?: TagType }>> = new Map();

  public storage: Map<KeyType, any> = new Map();

  constructor() {
    const self = this;

    for (let [key, artifact] of Registry.artifacts) {
      let scopedTarget = artifact.target;

      if (isClass(artifact.target)) {
        scopedTarget = new Proxy(scopedTarget, {
          construct(currentTarget, currentArgs, newTarget) {
            if (currentTarget.prototype !== newTarget.prototype) {
              return Reflect.construct(currentTarget, currentArgs, newTarget);
            }

            if (artifact.parameters) {
              let scope = ScopeEnum.Transient;
              if (currentTarget[Symbol.metadata]) {
                if (currentTarget[Symbol.metadata]?.scope) {
                  scope = currentTarget[Symbol.metadata]?.scope as any;
                }
              }

              for (let index = 0; index < artifact.parameters.length; index++) {
                currentArgs[index] = self.construct(artifact.parameters[index], scope);

                if (!currentArgs[index]) {
                  currentArgs[index] = Registry.artifacts.get(artifact.parameters[index])?.target;
                }
              }
            }

            return Reflect.construct(currentTarget, currentArgs, newTarget);
          },
        });
      }

      this.artifacts.set(key, scopedTarget);

      if (artifact.tag) {
        if (!this.artifactsByTag.has(artifact.tag)) {
          this.artifactsByTag.set(artifact.tag, new Map());
        }
  
        // @ts-ignore we already added the scoped target
        this.artifactsByTag.get(artifact.tag)?.set(key, this.artifacts.get(key));
      }
    }
  }

  public construct(key: KeyType, scope: ScopeEnum): any {
    if (scope == ScopeEnum.Perpetual) {
      if (Locator.containers.has('Perpetual')) {
        return Locator.containers.get('Perpetual')
          ?.construct(key, ScopeEnum.Transient);
      }
    }

    const artifact = this.artifacts.get(key);

    if (artifact) {
      if (scope == ScopeEnum.Ephemeral) {
        return Factory.construct(artifact.target);
      }

      if (scope == ScopeEnum.Transient) {
        if (this.storage.has(key)) {
          this.storage.set(key, Factory.construct(artifact.target));
        }
        return this.storage.get(key);
      }
    }

    return undefined;
  }
}

export default Container;
