import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import type { ContainerInterface } from '~/container/interfaces.ts';
import type { PackInterface } from '~/packer/interfaces.ts';

import Pack from '~/packer/decorations/pack.decoration.ts';
import Packer from '~/packer/services/packer.service.ts';

describe('packer', () => {
  @Pack()
  class Trace implements PackInterface {
    constructor(container: ContainerInterface) {
    }

    onBoot(container: ContainerInterface): Promise<void> {
      return Promise.resolve();
    }
  }
  
  @Pack({
    packs: [Trace]
  })
  class App implements PackInterface {
    constructor(container: ContainerInterface) {
    }
  }

  it('collect pack names', () => {
    const packer = new Packer(App)

    for (const packName of packer.packs) {
      expect(['App', 'Trace']).toContain(packName);
    }
  });

  it('can consume container artifacts', () => {
    expect(() => {
      const packer = new Packer(App)

      for (const packName of packer.packs) {
        const pack = packer.container.construct<PackInterface>(packName)
        if (pack?.onBoot) pack?.onBoot()
      }

    }).not.toThrow()
  })
  
});
