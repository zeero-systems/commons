import type { KeyableType } from '~/common/types.ts';
import type { ContainerInterface } from '~/container/interfaces.ts';
import type { ConsumerType, InjectType, ProviderType } from '~/container/types.ts';
import type { DecoratorType } from '~/decorator/types.ts';

import ConsumerAnnotation from '~/container/annotations/consumer.annotation.ts';

import DecoratorMetadata from '~/decorator/services/decorator-metadata.service.ts';
import DecoratorKindEnum from '~/decorator/enums/decorator-kind.enum.ts';
import Factory from '~/common/services/factory.service.ts';
import ScopeEnum from '~/container/enums/scope.enum.ts';
import Text from '~/common/services/text.service.ts';

import isClass from '~/common/guards/is-class.guard.ts';

export class Container implements ContainerInterface {
  public instances: Map<KeyableType, any> = new Map()
  
  constructor(
    public artifacts?: { providers?: Array<ProviderType>, consumers?: Array<ConsumerType> }, 
    public collection: Map<KeyableType, { artifact: ConsumerType | ProviderType, tags: Array<'P' | 'C'> }> = new Map(),
    public injection: Map<KeyableType, InjectType> = new Map()
  ) {
    this.addProviders(artifacts?.providers)
    this.addConsumers(artifacts?.consumers)
  }

  public duplicate(): ContainerInterface {
    return new Container({}, new Map(this.collection), new Map(this.injection));
  }

  public construct<T>(key: KeyableType, scope: ScopeEnum = ScopeEnum.Default): T | undefined {
    
    const item = this.collection.get(key);
    
    if (!item) return undefined
    
    let target = item.artifact.target
    if (isClass(target)) {
      if (item.tags.includes('C')) {
        target = this.createProxy(item.artifact, this);
      }
      
      if (scope == ScopeEnum.Transient) {
        return Factory.construct(target) as T | undefined;
      }
  
      if (!this.instances.has(item.artifact.name)) {
        this.instances.set(item.artifact.name, Factory.construct(target));
      }
  
      return this.instances.get(item.artifact.name);
    }
  
    return target as T;
  }

  public add(artifacts: Array<ConsumerType>, type: 'consumer'): void 
  public add(artifacts: Array<ProviderType>, type: 'provider'): void
  public add(artifacts: Array<ConsumerType> | Array<ProviderType>, type: 'consumer' | 'provider' = 'provider'): void {
    if (type == 'consumer') this.addConsumers(artifacts)
    else this.addProviders(artifacts)
  }

  public addProviders(providers?: Array<ProviderType>): void  {
    if (providers) {
     for (let index = 0; index < providers.length; index++) {
        const provider = providers[index];

        this.collection.set(provider.name, { artifact: provider, tags: ['P'] });
      }
    }
  }

  public addConsumers(consumers?: Array<ConsumerType>): void  {
    if (consumers) {
      for (let index = 0; index < consumers.length; index++) {
        const consumer = consumers[index];
        const provider = this.collection.get(consumer.name);

        const artifact: ConsumerType = {
          name: consumer.name,
          target: provider?.artifact.target || consumer.target,
          scope: consumer.scope
        };
        
        if (!this.injection.has(artifact.name)) {
          this.injection.set(artifact.name, {})
        }

        if (provider) {
          this.collection.set(artifact.name, { artifact: consumer, tags: ['P', 'C'] })
        } else {
          this.collection.set(artifact.name, { artifact: consumer, tags: ['C'] })
        }

        const injection = this.injection.get(artifact.name)
        if (isClass(artifact.target) && injection) {
          const metadata = DecoratorMetadata.get(artifact.target);
          const decorators = metadata.get('construct') || [undefined]
          
          for (const decorator of decorators) {
            this.addConsumerProperties(artifact.name, 'construct', Factory.getParameterNames(artifact.target, 'constructor'), decorator)
          }

          if (metadata) {
            for (const [key, decorators] of metadata.entries()) {
              const propertyName = String(key)

              if (propertyName != 'construct') {
                for (const decorator of decorators) {
                  if (decorator.annotation.target.name == 'Consumer') {
                    let propertyParameters: Array<KeyableType> = [propertyName]
                    if (decorator.decoration.kind == DecoratorKindEnum.METHOD) {
                      propertyParameters = Factory.getParameterNames(artifact.target, propertyName)
                    }
  
                    this.addConsumerProperties(artifact.name, propertyName, propertyParameters, decorator)
                  }
                }
              }              
            }
          }
        }
      }
    }
  }

  private addConsumerProperties(name: KeyableType, propertyName: string, propertyParameters: Array<KeyableType>, decorator?: DecoratorType) {
    const injection = this.injection.get(name)

    if (injection) {
      injection[propertyName] = []

      for (let jndex = 0; jndex < propertyParameters.length; jndex++) {
        const parameterName = propertyParameters[jndex];
        const provider = this.getProviderByName(parameterName, decorator)
        
        injection[propertyName].push({
          provider: Text.toFirstLetterUppercase(provider.name),
          scope: provider.scope
        })
      }
    }
  }

  private createProxy(consumer: ConsumerType, container: ContainerInterface) {
    return new Proxy(consumer.target, {
      construct(currentTarget: any, constructorArgs: any, newConstructorTarget: any) {
        if (currentTarget.prototype !== newConstructorTarget.prototype) {
          return Reflect.construct(currentTarget, constructorArgs, newConstructorTarget);
        }
        const consumerGraph = container.injection.get(consumer.name)
        if (consumerGraph && consumerGraph['construct']) {
          for (let index = 0; index < consumerGraph['construct'].length; index++) {
            const parameterProvider = consumerGraph['construct'][index]
  
            if (parameterProvider) {
              constructorArgs[index] = container.construct(parameterProvider.provider, parameterProvider.scope);
            }
          }
        }
        
        currentTarget = Reflect.construct(currentTarget, constructorArgs, newConstructorTarget);

        return new Proxy(currentTarget, {
          get(currentTarget: any, currentPropertyKey: any, currentReceiver: any) {
            if (consumerGraph && consumerGraph[currentPropertyKey]) {
              
              if (typeof currentTarget[currentPropertyKey] === 'function') {
                return function (this: any, ...methodArgs: any[]) {
                  const args = []
                  for (let index = 0; index < consumerGraph[currentPropertyKey].length; index++) {
                    const parameterProvider = consumerGraph[currentPropertyKey][index]
                    
                    if (parameterProvider) {
                      args.push(container.construct(parameterProvider.provider, parameterProvider.scope))
                    } else {
                      args.push(methodArgs[index] ? methodArgs[index] : undefined)
                    }
                  }
                  
                  return currentTarget[currentPropertyKey].apply(this === currentReceiver ? currentTarget : this, args);
                };
              }

              return container.construct(consumerGraph[currentPropertyKey][0].provider, consumerGraph[currentPropertyKey][0].scope);
            }

            return Reflect.get(currentTarget, currentPropertyKey, currentReceiver);
          },
        })
        
      },
    });
  }

  private getProviderByName(name: KeyableType, decorator?: DecoratorType): { name: KeyableType, scope: ScopeEnum } {
    const provider = { name, scope: ScopeEnum.Default }
    const annotation = decorator?.annotation.target as ConsumerAnnotation | undefined

    if (annotation?.provider) provider.name = annotation.provider
    if (annotation?.options?.scope) provider.scope = annotation.options.scope

    return provider
  }
}

export default Container;
