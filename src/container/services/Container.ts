import type { ProviderType } from '~/container/types.ts';
import type { ConstructorArgType } from '~/common/types.ts';

import Factory from '~/common/services/Factory.ts';
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

  static set(targetName: string | symbol, target: ProviderType): Map<string | symbol, ProviderType> {
    return Container.providers.set(targetName, target);
  }

  static construct(targetName: string | symbol, options?: { arguments?: ConstructorArgType<any> }): any {
    if (Container.providers.has(targetName)) {
      const provider = Container.providers.get(targetName);

      if (isClass(provider)) {
        return Factory.construct(provider, options)
      }

      return provider;
    }
  }
}

export default Container;
