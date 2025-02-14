import { ModuleType } from '~/module/types.ts';
import constructFn from '~/common/functions/constructFn.ts';

export class Module {

  static modules: Map<string | symbol, ModuleType> = new Map()

  static exists(targetName: string | symbol,): boolean {
    return Module.modules.has(targetName)
  }

  static set(target: ModuleType, targetName: string | symbol,): Map<string | symbol, ModuleType> {
    return Module.modules.set(targetName, target)
  }

  static construct(targetName: string | symbol): (new (...args: any) => any) | object | undefined {    
    if (Module.modules.has(targetName)) {
      const module = Module.modules.get(targetName)

      if (module) {
        return constructFn(module)
      }

      return
    }
  }
}

export default Module