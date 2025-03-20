// deno-lint-ignore-file no-this-alias
import type { ContainerInterface } from '~/container/interfaces.ts';
import type { ArtifactType, KeyType, TagType } from '~/common/types.ts';

import Factory from '~/common/services/Factory.ts';
import isClass from '~/common/guards/isClass.ts';
import Artifactor from '~/common/services/Artifactor.ts';
import ScopeEnum from '~/container/enums/ScopeEnum.ts';
import Locator from '~/container/services/Locator.ts';
import Text from '~/common/services/Text.ts';
import Parameter from '~/common/services/Parameter.ts';
import Tagger from '~/common/services/Tagger.ts';

export class Container implements ContainerInterface {
  public artifacts: Map<KeyType, ArtifactType> = new Map();
  public artifactsByTag: Map<TagType, Map<KeyType, ArtifactType>> = new Map();
  
  public instances: Map<KeyType, any> = new Map();

  constructor() {
    
    this.init()
  }

  private init(): void {
    const self = this;

    for (let [key, artifact] of Artifactor.artifacts) {
      let scopedTarget = artifact.target;

      if (isClass(artifact.target)) {
        scopedTarget = new Proxy(scopedTarget, {
          construct(currentTarget, currentArgs, newTarget) {
            if (currentTarget.prototype !== newTarget.prototype) {
              return Reflect.construct(currentTarget, currentArgs, newTarget);
            }

            const parameters = Parameter.get(currentTarget);
            
            if (parameters) {
              let scope = ScopeEnum.Transient;
              if (currentTarget[Symbol.metadata]) {
                if (currentTarget[Symbol.metadata]?.scope) {
                  scope = currentTarget[Symbol.metadata]?.scope as any;
                }
              }

              for (let index = 0; index < parameters.length; index++) {
                currentArgs[index] = Artifactor.artifacts.get(parameters[index])?.target;

                if (!currentArgs[index] || isClass(currentArgs[index])) {
                  currentArgs[index] = self.construct(Text.toFirstLetterUppercase(parameters[index]), scope);
                }
              }
            }

            return Reflect.construct(currentTarget, currentArgs, newTarget);
          },
        });
      }
      
      console.log('scopedTarget[Symbol.metadata]', scopedTarget[Symbol.metadata])

      this.artifacts.set(key, { ...artifact, target: scopedTarget });

      console.log(artifact.name, Tagger.get(artifact.target))

      for (const tag of Tagger.get(artifact.target)) {
        if (!this.artifactsByTag.has(tag)) {
          this.artifactsByTag.set(tag, new Map());
        }
  
        // @ts-ignore we already added the scoped target
        this.artifactsByTag.get(tag)?.set(key, this.artifacts.get(key));
      } 
    }
  }

  public construct<T>(key: KeyType, scope: ScopeEnum = ScopeEnum.Transient): T | undefined {
    if (scope == ScopeEnum.Perpetual) {
      if (Locator.containers.has('Perpetual')) {
        return Locator.containers.get('Perpetual')
          ?.construct(key, ScopeEnum.Transient) as T
      }
    }

    const artifact = this.artifacts.get(key);
    
    if (artifact) {
      if (scope == ScopeEnum.Ephemeral) {
        return Factory.construct(artifact.target);
      }
      
      if (scope == ScopeEnum.Transient) {
        if (!this.instances.has(key)) {
          this.instances.set(key, Factory.construct(artifact.target));
        }
        return this.instances.get(key);
      }
    }

    return undefined
  }

  static create(key: KeyType): ContainerInterface {
    return Locator.containers.set(key, new Container()).get(key) as ContainerInterface;
  }
}

export default Container;
