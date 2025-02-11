import { ProviderType } from '~/provider/types.ts';
import constructFn from '~/common/functions/constructFn.ts';

export class Provider {

  static providers: Map<string | symbol, ProviderType> = new Map()

  static hasProvider(targetName: string | symbol,): boolean {
    return Provider.providers.has(targetName)
  }

  static setProvider(target: ProviderType, targetName: string | symbol,): Map<string | symbol, ProviderType> {
    return Provider.providers.set(targetName, target)
  }

  static instantiateProvider(targetName: string | symbol): (new (...args: any) => any) | object | undefined {    
    if (Provider.providers.has(targetName)) {
      const provider = Provider.providers.get(targetName) as ProviderType

      if (typeof provider == 'object') {
        return provider
      }

      return constructFn(provider)
    }
  }
}

export default Provider