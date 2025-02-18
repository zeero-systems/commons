import type { DecorationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorType } from '~/decorator/types.ts';

import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';

import decorateFn from '~/decorator/functions/decorateFn.ts';

export class Mixin implements DecorationInterface {
  group = DecoratorGroupEnum.HIDDEN;

  onAttach<T, P>(decorator: DecoratorType<T, P>, decoration?: DecorationType<P & any[]>): any {
    if (decoration?.parameters) {
      for (let index = 0; index < decoration.parameters.length; index++) {
        decorator.target = decoration.parameters[index](decorator.target, decorator.context)
      }
    }

    return decorator.target
  }
}

export default (decorations: any[]) => decorateFn(Mixin, decorations);