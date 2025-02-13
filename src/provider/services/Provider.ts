import { ProviderType } from '~/provider/types.ts';
import constructFn from '~/common/functions/constructFn.ts';
import guardProviderPlainFn from '~/provider/guards/guardProviderPlainFn.ts';
import guardProviderClassFn from '~/provider/guards/guardProviderClassFn.ts';
import ProviderException from '~/provider/exceptions/ProviderException.ts';

export class Provider {

  static providers: Map<string | symbol, ProviderType> = new Map()

  static exists(targetName: string | symbol,): boolean {
    return Provider.providers.has(targetName)
  }

  static set(target: ProviderType, targetName: string | symbol,): Map<string | symbol, ProviderType> {
    return Provider.providers.set(targetName, target)
  }

  static construct(targetName: string | symbol): (new (...args: any) => any) | object | undefined {    
    if (Provider.providers.has(targetName)) {
      const provider = Provider.providers.get(targetName)

      if (guardProviderPlainFn(provider)) {
        return provider
      }

      if (guardProviderClassFn(provider)) {
        return constructFn(provider)
      }

      return
    }
  }
}

export default Provider