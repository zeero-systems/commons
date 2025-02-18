import type { ModuleType } from '~/module/types.ts';

import constructFn from '~/common/functions/constructFn.ts';

export class Modulator {
  static modules: Map<string | symbol, ModuleType> = new Map();

  static exists(targetName: string | symbol): boolean {
    return Modulator.modules.has(targetName);
  }

  static set(target: ModuleType, targetName: string | symbol): Map<string | symbol, ModuleType> {
    return Modulator.modules.set(targetName, target);
  }

  static construct(targetName: string | symbol): (new (...args: any) => any) | object | undefined {
    if (Modulator.modules.has(targetName)) {
      const module = Modulator.modules.get(targetName);

      if (module) {
        return constructFn(module);
      }

      return;
    }
  }
}

export default Modulator;
