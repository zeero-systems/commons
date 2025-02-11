
import firstLetterToUppercaseFn from '~/common/functions/toFirstLetterUppercaseFn.ts';
import ContextTagEnum, { DecoratorGroupEnum } from '~/decorator/enums/DecoratorGroupEnum.ts';
import Metadata from '~/decorator/services/Metadata.ts';
import { DecorationInterface } from '~/decorator/interfaces.ts';
import { DecorationType, DecoratorType } from '~/decorator/types.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import MetadataTagEnum from '~/common/enums/MetadataTagEnum.ts';
import ProviderService from '~/provider/services/Provider.ts';
import DecoratorException from '~/decorator/exceptions/DecoratorException.ts';
import guardClassMemberDecoratorContextFn from '~/decorator/guards/guardClassMemberDecoratorContextFn.ts';
import applyDecorationFn from '~/decorator/functions/applyDecorationFn.ts';

type ParamsType = {
  propertyDecorator: {
    enumerable: true,
    configurable: true,
  }
}

export class Provider implements DecorationInterface {
  group: DecoratorGroupEnum = DecoratorGroupEnum.PROVIDERS

  onAttach<T, P>(decorator: DecoratorType<T, P>, _decoration: DecorationType<P>) {
    
    const target = decorator.target as any;
    
    if (decorator.context.kind == DecoratorKindEnum.CLASS) {

      const targetName = firstLetterToUppercaseFn(decorator.targetName)
      const context = decorator.context

      if (!Metadata.hasTag<T, P>(context.metadata, MetadataTagEnum.PROVIDER)) {
        Metadata.addTag<T, P>(context.metadata, MetadataTagEnum.PROVIDER)
        ProviderService.setProvider(target, targetName)
      }
      
      return target
    }

    if (decorator.context.kind == DecoratorKindEnum.FIELD || decorator.context.kind == DecoratorKindEnum.ACCESSOR) {
      return
    }

    throw new DecoratorException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: decorator.targetName, kind: decorator.context.kind },
    })
  }
}

export default (parameters?: ParamsType) => applyDecorationFn(Provider, parameters);
