// deno-lint-ignore-file no-this-alias
import type { ContainerInterface } from '~/container/interfaces.ts';
import type { ArtifactType, KeyType, TagType } from '~/common/types.ts';

import { Consume } from '~/container/annotations/Consume.ts';

import Factory from '~/common/services/Factory.ts';
import isClass from '~/common/guards/isClass.ts';
import Artifactor from '~/common/services/Artifactor.ts';
import ScopeEnum from '~/container/enums/ScopeEnum.ts';
import Locator from '~/container/services/Locator.ts';
import Text from '~/common/services/Text.ts';
import Parameter from '~/common/services/Parameter.ts';
import Tagger from '~/common/services/Tagger.ts';
import Decorator from '~/decorator/services/Decorator.ts';

export class Container implements ContainerInterface {
  static artifacts: Map<KeyType, ArtifactType> = new Map();
  static artifactsByTag: Map<TagType, Map<KeyType, ArtifactType>> = new Map();
  
  public instances: Map<KeyType, any> = new Map();

  constructor() {
    if (
      Artifactor.artifacts.size > 0 &&
      Container.artifacts.size == 0
    ) {
      this.wrapperify()
    }
  }

  private wrapperify(): void {
    const self = this;

    for (let [key, artifact] of Artifactor.artifacts) {
      let proxyTarget = artifact.target;
      const tags = Tagger.get(artifact.target)
      
      if (tags.includes(Locator.consumer)) {
        if (isClass(artifact.target)) {
          proxyTarget = new Proxy(proxyTarget, {
            get(currentTarget: any, currentPropertyKey, currentReceiver: any) {
              const consume = Decorator.getDecoration(currentTarget, Consume, currentPropertyKey)

              if (consume) {
                let scope = ScopeEnum.Transient;
                if (consume.parameters.scope) {
                  scope = consume.parameters.scope;
                }

                let providerName = currentPropertyKey
                if (consume.parameters.providerName) {
                  providerName = consume.parameters.providerName
                  if (isClass(consume.parameters.providerName)) {
                    providerName = consume.parameters.providerName.name
                  }
                }
                
                return self.construct(Text.toFirstLetterUppercase(providerName), scope);
              }
              
              return Reflect.get(currentTarget, currentPropertyKey, currentReceiver)
            },
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
                  currentArgs[index] = self.construct(Text.toFirstLetterUppercase(parameters[index]), scope);
                }
              }
  
              return Reflect.construct(currentTarget, currentArgs, newTarget);
            },
          });
        }
      }

      Container.artifacts.set(key, { ...artifact, target: proxyTarget });
      
      for (const tag of Tagger.get(artifact.target)) {
        if (!Container.artifactsByTag.has(tag)) {
          Container.artifactsByTag.set(tag, new Map());
        }
  
        // @ts-ignore we already added the scoped target
        Container.artifactsByTag.get(tag)?.set(key, Container.artifacts.get(key));
      } 
    }
  }

  public construct<T>(key: KeyType, scope: ScopeEnum = ScopeEnum.Transient): T | undefined {
    
    let artifact = Container.artifactsByTag.get(Locator.provider)?.get(key);

    if (artifact && isClass(artifact.target)) {
      if (scope == ScopeEnum.Perpetual) {
        if (Locator.containers.has('Perpetual')) {
          return Locator.containers.get('Perpetual')
            ?.construct(key, ScopeEnum.Transient) as T
        }
      }

      if (scope == ScopeEnum.Ephemeral) {
        return Factory.construct(artifact.target as any);
      }
      
      if (scope == ScopeEnum.Transient) {
        if (!this.instances.has(key)) {
          this.instances.set(key, Factory.construct(artifact.target));
        }
        return this.instances.get(key);
      }
    }

    artifact = Container.artifacts.get(key);

    return artifact?.target as T
  }

  static create(key: KeyType): ContainerInterface {
    return Locator.containers.set(key, new Container()).get(key) as ContainerInterface;
  }
}

export default Container;
