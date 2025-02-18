import type { DecorationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorType } from '~/decorator/types.ts';

import DecoratorException from '~/decorator/exceptions/DecoratorException.ts';
import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import Metadata from '~/decorator/services/Metadata.ts';
import MetadataTagEnum from '~/common/enums/MetadataTagEnum.ts';

import decorateFn from '~/decorator/functions/decorateFn.ts';

export class Singleton implements DecorationInterface {
  group = DecoratorGroupEnum.COMMONS;

  onAttach<T, P>(decorator: DecoratorType<T, P>, _decoration?: DecorationType<P>): any {
    let target = decorator.target as any;
    const context = decorator.context as any;
    
    if (decorator.context.kind == DecoratorKindEnum.CLASS) {

      if (!Metadata.hasTag<T, P>(context, MetadataTagEnum.SINGLETON)) {
        Metadata.applyTag<T, P>(context, MetadataTagEnum.SINGLETON);

        target = new Proxy(target as any, {
          construct(currentTarget, currentArgs, newTarget) {
            if (currentTarget.prototype !== newTarget.prototype) {
              return Reflect.construct(currentTarget, currentArgs, newTarget);
            }

            if (!context.metadata.singleton) {
              context.metadata.singleton = Reflect.construct(currentTarget, currentArgs, newTarget);
            }

            return context.metadata.singleton;
          },
        });

        target.toString = Function.prototype.toString.bind(decorator.target)
      }

      return target
    }

    throw new DecoratorException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: decorator.targetName, kind: decorator.context.kind },
    });
  }
}

export default () => decorateFn(Singleton);
