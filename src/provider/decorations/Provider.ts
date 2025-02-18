import type { DecorationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorType } from '~/decorator/types.ts';
import type { ProviderParameterType, ProviderType } from '~/provider/types.ts';

import DecoratorException from '~/decorator/exceptions/DecoratorException.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';
import Injector from '~/provider/services/Injector.ts';
import Metadata from '~/decorator/services/Metadata.ts';
import MetadataTagEnum from '~/common/enums/MetadataTagEnum.ts';

import decorateFn from '~/decorator/functions/decorateFn.ts';
import firstLetterUppercaseFn from '~/common/functions/firstLetterUppercaseFn.ts';

export class Provider implements DecorationInterface {
  group: DecoratorGroupEnum = DecoratorGroupEnum.COMMONS;

  onAttach<T, P>(decorator: DecoratorType<T & ProviderType, P>, _decoration?: DecorationType<P & ProviderParameterType>): any {
    const target = decorator.target as any;
    const targetName = decorator.targetName;
    const context = decorator.context as any;

    if (context.kind == DecoratorKindEnum.CLASS) {
      if (!Metadata.hasTag<T, P>(context, MetadataTagEnum.PROVIDER)) {
        Metadata.applyTag<T, P>(context, MetadataTagEnum.PROVIDER)
        Injector.set(target, firstLetterUppercaseFn(targetName))
      }

      return target
    }

    throw new DecoratorException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: targetName, kind: context.kind },
    });
  }
}

export default (parameters?: ProviderParameterType) => decorateFn(Provider, parameters);
