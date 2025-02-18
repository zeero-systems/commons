import type { ProviderType } from '~/provider/types.ts';

import constructFn from '~/common/functions/constructFn.ts';
import guardProviderPlainFn from '~/provider/guards/isProviderPlainFn.ts';
import guardProviderClassFn from '~/provider/guards/isProviderClassFn.ts';

export class Injector {
  static providers: Map<string | symbol, ProviderType> = new Map();

  static exists(targetName: string | symbol): boolean {
    return Injector.providers.has(targetName);
  }

  static set(target: ProviderType, targetName: string | symbol): Map<string | symbol, ProviderType> {
    return Injector.providers.set(targetName, target);
  }

  static construct(targetName: string | symbol): (new (...args: any) => any) | object | undefined {
    if (Injector.providers.has(targetName)) {
      const provider = Injector.providers.get(targetName);

      if (guardProviderPlainFn(provider)) {
        return provider;
      }

      if (guardProviderClassFn(provider)) {
        return constructFn(provider);
      }

      return;
    }
  }
}

export default Injector;
