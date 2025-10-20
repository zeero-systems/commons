import type { ArtifactType, KeyableType, NewableType } from '~/common/types.ts';
import type { ContainerInterface } from '~/container/interfaces.ts';
import type { PackerInterface, PackInterface } from '~/packer/interfaces.ts';
import type { UnpackType } from '~/packer/types.ts';

import Container from '~/container/services/container.service.ts';
import DecoratorMetadata from '~/decorator/services/decorator-metadata.service.ts';
import PackAnnotation from '~/packer/annotations/pack.annotation.ts';
import ScopeEnum from '~/container/enums/scope.enum.ts';

import isArtifact from '~/common/guards/is-artifact.guard.ts';

export class Packer implements PackerInterface {
  public packs: Array<KeyableType> = []
  public container: ContainerInterface

  constructor(public pack: NewableType<new (...args: any[]) => PackInterface>) {
    this.container = new Container(this.unpack(pack))
    this.container.add([{ name: 'Container', target: this.container }], 'provider')
  }

  public artifacts(): Array<ArtifactType> {
    return this.container.collection.values().map((collection) => collection.artifact).toArray() || []
  }

  public unpack(pack: NewableType<new (...args: any[]) => PackInterface>): UnpackType {
    const collection: UnpackType = { providers: [], consumers: [] }
    const decorator = DecoratorMetadata.findByAnnotationInteroperableName(pack, 'pack', 'construct')
    
    if (decorator) {
      const name = pack.name
      const annotation = decorator.annotation.target as PackAnnotation
      
      
      if (annotation.options?.providers) {
        collection.providers = annotation.options?.providers.map((provider) => {
          if (isArtifact(provider)) return provider
          return { name: provider.name || provider.constructor.name, target: provider }
        })
      }
      
      if (annotation.options?.consumers) {
        collection.consumers = annotation.options.consumers.map((consumer) => {
          if (isArtifact(consumer)) return consumer
          return { name: consumer.name || consumer.constructor.name, target: consumer, scope: ScopeEnum.Default }
        })
      }
      
      this.packs.unshift(name)

      if (annotation.options?.packs) {
        for (const pack of annotation.options.packs) {
          const collectResult = this.unpack(pack)
          collection.providers.push(...collectResult.providers)
          collection.consumers.push(...collectResult.consumers)
        }
      }
      
      collection.consumers.push({ name, target: pack })
    }

    return collection
  }
}

export default Packer
