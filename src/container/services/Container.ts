import type { ProviderType } from '~/container/types.ts';
import type { ConstructorArgType } from '~/common/types.ts';

import Factory from '~/common/services/Factory.ts';

import guardProviderPlain from '~/container/guards/isProviderPlain.ts';
import guardProviderClass from '~/container/guards/isProviderClass.ts';
import isClass from '~/common/guards/isClass.ts';

export class Container {
  public static readonly module: unique symbol = Symbol('MODULE')
  public static readonly component: unique symbol = Symbol('COMPONENT')
  public static readonly consumer: unique symbol = Symbol('CONSUMER')
  public static readonly provider: unique symbol = Symbol('PROVIDER')

  static providers: Map<string | symbol, ProviderType> = new Map();

  static exists(targetName: string | symbol): boolean {
    return Container.providers.has(targetName);
  }

  static set(targetName: string | symbol, target: ProviderType,): Map<string | symbol, ProviderType> {
    return Container.providers.set(targetName, target);
  }

  static construct(targetName: string | symbol, options?: { arguments?: ConstructorArgType<any> }): (new (...args: any) => any) | object | undefined {
    if (Container.providers.has(targetName)) {
      const provider = Container.providers.get(targetName);

      if (guardProviderPlain(provider)) {
        if (isClass(provider.value)) {
          return Factory.construct(provider.value, options)
        }

        return provider.value;
      }

      if (guardProviderClass(provider)) {
        return Factory.construct(provider, options)
      }

      return;
    }
  }
}

export default Container;
