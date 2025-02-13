
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
import { ConsumerObjectParameterType, ConsumerParameterType } from '~/provider/types.ts';
import guardStringFn from '~/common/guards/guardStringFn.ts';
import guardConsumerObjectParameterFn from '../guards/guardConsumerObjectParameterFn.ts';
import ProviderException from '~/provider/exceptions/ProviderException.ts';
import guardClassFn from '~/common/guards/guardClassFn.ts';

type ParamsType = {
  propertyDecorator: {
    enumerable: true,
    configurable: true,
  }
}

export class Consumer implements DecorationInterface {
  group: DecoratorGroupEnum = DecoratorGroupEnum.COMMONS

  onAttach<T, P>(decorator: DecoratorType<T, P>, decoration: DecorationType<P & ConsumerParameterType>) {
    
    const target = decorator.target as any;
    
    let decoratorProvider: ConsumerObjectParameterType = {}
    if (guardStringFn(decoration.parameters)) {
      decoratorProvider[decoration.parameters] = { optional: true }
    }
    if (guardClassFn(decoration.parameters)) {
      decoratorProvider[decoration.parameters.name] = { optional: true }
    }
    if (guardConsumerObjectParameterFn(decoration.parameters)) {
      decoratorProvider = decoration.parameters
    }
    
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
              const providerName = firstLetterToUppercaseFn(String(targetParameters[index]))
              
              if (
                !ProviderService.exists(providerName) &&
                !decoratorProvider[providerName]?.optional
              ) {
                throw new ProviderException("Provider {name} not found", {
                  key: "NOT_FOUND",
                  context: { name: providerName }
                });
              }
              
              currentArgs[index] = ProviderService.construct(providerName)
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

          let providerName = decorator.context.name
          if (guardStringFn(decoration.parameters)) {
            providerName = decoration.parameters
          }
          if (guardClassFn(decoration.parameters)) {
            providerName = decoration.parameters.name
          }

          console.log('providerName', providerName)

          if (
            !ProviderService.exists(providerName) &&
            decoratorProvider[providerName] &&
            !decoratorProvider[providerName].optional
          ) {
            throw new ProviderException("Provider {name} not found", {
              key: "NOT_FOUND",
              context: { name: providerName }
            });
          }
          
          return ProviderService.construct(toFirstLetterUpperCase(providerName))
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

export default (parameters?: ConsumerParameterType) => applyDecorationFn(Consumer, parameters);
