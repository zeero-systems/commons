import type { ArtifactType, KeyableType } from '~/common/types.ts';
import type { ContainerInterface } from '~/container/interfaces.ts';
import type { PackerInterface } from '~/packer/interfaces.ts';
import type { DispatcherInterface } from '~/emitter/interfaces.ts';
import type { PackNewableType } from '~/packer/types.ts';

import Container from '~/container/services/container.service.ts';
import DecoratorMetadata from '~/decorator/services/decorator-metadata.service.ts';
import Dispatcher from '~/emitter/services/dispatcher.service.ts';
import PackAnnotation from '~/packer/annotations/pack.annotation.ts';
import ScopeEnum from '~/container/enums/scope.enum.ts';

import isArtifact from '~/common/guards/is-artifact.guard.ts';

export class Packer implements PackerInterface {
  public packs: Array<KeyableType> = []
  public container: ContainerInterface
  public dispatcher: DispatcherInterface<{ unpacked: [PackNewableType] }> = new Dispatcher<{ unpacked: [PackNewableType] }>();

  constructor(
    public pack: PackNewableType,
    subscribers: Array<(pack: PackNewableType) => void> = []
  ) {
    this.container = new Container()
    this.container.add([{ name: 'Container', target: this.container }], 'provider')

    for (const subscriber of subscribers) {
      this.dispatcher.subscribe('unpacked', subscriber)
    }

    this.unpack(pack)
  }

  public artifacts(): Array<ArtifactType> {
    return this.container.collection.values().map((collection) => collection.artifact).toArray() || []
  }

  public unpack(pack: PackNewableType): void {
    const decorator = DecoratorMetadata.findByAnnotationInteroperableName(pack, 'pack', 'construct')
    
    if (decorator) {
      const name = pack.name
      const annotation = decorator.annotation.target as PackAnnotation
      
      if (annotation.options?.providers) {
        const providers = annotation.options?.providers.map((provider) => {
          if (isArtifact(provider)) return provider
          return { name: provider.name || provider.constructor.name, target: provider }
        })

        this.container.add(providers, 'provider')
      }
      
      if (annotation.options?.consumers) {
        const consumers = annotation.options.consumers.map((consumer) => {
          if (isArtifact(consumer)) return consumer
          return { name: consumer.name || consumer.constructor.name, target: consumer, scope: ScopeEnum.Default }
        })

        this.container.add(consumers, 'consumer')
      }
      
      this.packs.unshift(name)

      if (annotation.options?.packs) {
        for (const pack of annotation.options.packs) {
          this.unpack(pack)
        }
      }
      
      this.container.add([{ name, target: pack }], 'consumer')
      this.dispatcher.dispatch('unpacked', pack)
    }
  }
}

export default Packer
