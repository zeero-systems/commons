import type { ComponentParametersType } from '~/module/types.ts';
import type { DecorationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorType } from '~/decorator/types.ts';

import Consumer from '~/provider/decorations/Consumer.ts';
import Component from '~/module/decorations/Component.ts';
import DecoratorException from '~/decorator/exceptions/DecoratorException.ts';
import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import Mixin from '~/decorator/decorations/Mixin.ts';
import Provider from '~/provider/decorations/Provider.ts';
import Singleton from '~/common/decorations/Singleton.ts';

import decorateFn from '~/decorator/functions/decorateFn.ts';

export class Module implements DecorationInterface {
  group: DecoratorGroupEnum = DecoratorGroupEnum.COMMONS;

  onAttach<T, P>(decorator: DecoratorType<T, P>, decoration?: DecorationType<P & ComponentParametersType>) {
    if (decorator.context.kind == DecoratorKindEnum.CLASS) {
      return Mixin([Consumer(), Provider(), Component(decoration?.parameters), Singleton() ])(decorator.target, decorator.context as any)
    }

    throw new DecoratorException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: decorator.targetName, kind: decorator.context.kind },
    });
  }
}

export default (parameters?: ComponentParametersType) => decorateFn(Module, parameters);
