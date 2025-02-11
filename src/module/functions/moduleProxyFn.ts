import Context from 'packages/decorator/Context.ts';
import DecorationType from 'packages/decorator/types/DecorationType.ts';
import DecoratorType from 'packages/decorator/types/DecoratorType.ts';
import ModuleArgumentsType from 'packages/module/types/ModuleArgumentsType.ts';
import Registry from 'packages/common/Registry.ts';
import TagEnum from 'packages/decorator/enums/TagEnum.ts';

import firstLetterToUppercaseFn from 'packages/common/functions/firstLetterToUppercaseFn.ts';
import guardProviderClassFn from 'packages/provider/guards/guardProviderClassFn.ts';
import guardProviderPlainFn from 'packages/provider/guards/guardProviderPlainFn.ts';
import providerProxyFn from 'packages/provider/functions/providerProxyFn.ts';

import applyTagFn from '~/decorator/functions/applyTagFn.ts';
import hasTagFn from '~/decorator/functions/hasTagFn.ts';

export const moduleProxyFn = <T, P>(decorator: DecoratorType<T, P>, decoration: DecorationType<P>) => {
  
  const targetName = firstLetterToUppercaseFn(decorator.targetName)
  const context = decorator.context
  const parameters = decoration.parameters as ModuleArgumentsType;

  if (!hasTagFn<T, P>(context, TagEnum.MODULE)) {
    applyTagFn<T, P>(context, TagEnum.MODULE)
    
    if (parameters && parameters.providers) {
      for (let index = 0; index < parameters.providers.length; index++) {
        const provider = parameters.providers[index];
        const providerName = firstLetterToUppercaseFn(provider.name || provider.constructor.name);

        if (!Registry.providers.has(providerName)) {
          if (guardProviderClassFn(provider)) {
            Registry.providers.set(providerName, provider);
          }

          if (guardProviderPlainFn(provider)) {
            Registry.providers.set(providerName, provider.value);
          }
        }
      }
    }

    decorator.target = providerProxyFn<T, P>(decorator)

    Registry.modules.set(targetName, parameters);
  }
  
  return decorator.target
}

export default moduleProxyFn