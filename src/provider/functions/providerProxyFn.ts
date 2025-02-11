import Context from 'packages/decorator/Context.ts';
import DecoratorType from 'packages/decorator/types/DecoratorType.ts';
import Registry from 'packages/common/Registry.ts';
import TagEnum from 'packages/decorator/enums/TagEnum.ts';

import firstLetterToUppercaseFn from 'packages/common/functions/firstLetterToUppercaseFn.ts';
import singletonProxyFn from 'packages/common/functions/singletonProxyFn.ts';

export const providerProxyFn = <T, P>(decorator: DecoratorType<T, P>) => {
  
  let target = decorator.target as any
  const targetName = firstLetterToUppercaseFn(decorator.targetName)
  const targetParameters = decorator.targetParameters
  const context = decorator.context

  if (!Context.hasMetadataTag(context, TagEnum.PROVIDER)) {
    Context.addMetadataTag<T, P>(context, TagEnum.PROVIDER)

    target = new Proxy(target, {
      construct(currentTarget, currentArgs, newTarget) {

        if (currentTarget.prototype !== newTarget.prototype) {
          return Reflect.construct(currentTarget, currentArgs, newTarget);
        }

        for (let index = 0; index < targetParameters.length; index++) {        
          const parameterProviderName = firstLetterToUppercaseFn(String(targetParameters[index]))
          currentArgs[index] = Registry.providers.getInstance(parameterProviderName)
        }

        return Reflect.construct(currentTarget, currentArgs, newTarget)
      }
    })

    decorator.target = target
    decorator.target = singletonProxyFn<T, P>(decorator)
    
    Registry.providers.set(targetName, decorator.target as any)
  }
  
  return target
}

export default providerProxyFn


        // const instance = new Proxy(Reflect.construct(currentTarget, currentArgs, newTarget), {
        //   get: (target: any, propertKey, receiver) => {
        //     if (targetParameters.includes(String(propertKey))) {
        //       return Registry.providers.get(firstLetterToUppercaseFn(propertKey))
        //     }
        //     return Reflect.get(target, propertKey, receiver)
        //   },
        // })

        // const providerName = firstLetterToUppercaseFn(targetName);
        // if (!Registry.providers.has(providerName)) {
        //   Registry.providers.set(providerName, instance)
        // }

        // return Registry.providers.get(providerName)