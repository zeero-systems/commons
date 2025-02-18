import type { DecorationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorType } from '~/decorator/types.ts';

import decorateFn from '~/decorator/functions/decorateFn.ts';
import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';

export class Debug implements DecorationInterface {
  group = DecoratorGroupEnum.COMMONS;

  onAttach<T, P>(decorator: DecoratorType<T, P>, decoration?: DecorationType<P>): any {
    console.log('onAttach', { decorator, decoration });
  }

  onInitialize<T, P>(decorator: DecoratorType<T, P>, decoration?: DecorationType<P>): any {
    console.log('onInitialize', { decorator, decoration });
  }
}

export default () => decorateFn(Debug);
