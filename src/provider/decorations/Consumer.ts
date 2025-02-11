
import firstLetterToUppercaseFn from '~/common/functions/toFirstLetterUppercaseFn.ts';
import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';
import Metadata from '~/decorator/services/Metadata.ts';
import { DecorationInterface } from '~/decorator/interfaces.ts';
import { DecorationType, DecoratorType } from '~/decorator/types.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import MetadataTagEnum from '~/common/enums/MetadataTagEnum.ts';
import ProviderService from '~/provider/services/Provider.ts';
import DecoratorException from '~/decorator/exceptions/DecoratorException.ts';
import applyDecorationFn from '~/decorator/functions/applyDecorationFn.ts';
import toFirstLetterUpperCase from "~/common/functions/toFirstLetterUppercaseFn.ts"

type ParamsType = {
  propertyDecorator: {
    enumerable: true,
    configurable: true,
  }
}

export class Consumer implements DecorationInterface {
  group: DecoratorGroupEnum = DecoratorGroupEnum.COMMONS

  onAttach<T, P>(decorator: DecoratorType<T, P>, decoration: DecorationType<P> & { parameters?: { providerName: string } }) {
    
    const target = decorator.target as any;
    
    if (decorator.context.kind == DecoratorKindEnum.CLASS) {

      const targetParameters = decorator.targetParameters
      const context = decorator.context

      if (!Metadata.hasTag<T, P>(context.metadata, MetadataTagEnum.CONSUMER)) {
        Metadata.addTag<T, P>(context.metadata, MetadataTagEnum.CONSUMER)
        
        return new Proxy(target, {
          construct(currentTarget, currentArgs, newTarget) {

            if (currentTarget.prototype !== newTarget.prototype) {
              return Reflect.construct(currentTarget, currentArgs, newTarget);
            }
            
            for (let index = 0; index < targetParameters.length; index++) {        
              const parameterProviderName = firstLetterToUppercaseFn(String(targetParameters[index]))
              currentArgs[index] = ProviderService.instantiateProvider(parameterProviderName)
            }

            return Reflect.construct(currentTarget, currentArgs, newTarget);
          }
        })
      }

      return target
    }

    if (decorator.context.kind == DecoratorKindEnum.ACCESSOR) {
      return {
        set: function () {},
        get: function () {
          if (!decorator.context.name) return undefined
          const providerName = decoration.parameters?.providerName || decorator.context.name
          return ProviderService.instantiateProvider(toFirstLetterUpperCase(providerName))
        },
        thrownable: true,
        propertyDecorator: {
          enumerable: true,
          configurable: true
        }
      }
    }

    throw new DecoratorException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: decorator.targetName, kind: decorator.context.kind },
    })
  }
}

export default (parameters?: { providerName: string }) => applyDecorationFn(Consumer, parameters);
