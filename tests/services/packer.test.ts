import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Entity from '~/entity/services/entity.service.ts';
import Packer from '~/packer/services/packer.service.ts';
import Pack from '~/packer/decorations/pack.decoration.ts';
import { PackInterface } from '@zeero-systems/commons';

describe('packer', () => {
  @Pack()
  class Trace implements PackInterface {
    constructor() { }
  }
  
  @Pack({
    packs: [Trace]
  })
  class App implements PackInterface {
    constructor() { }
  }

  it('collect pack names', () => {
    const packer = new Packer(App)

    for (const packName of packer.packs) {
      expect(['App', 'Trace']).toContain(packName);
    }
  });
  
});
