import type { DecorationType, DecoratorType } from '~/decorator/types.ts';

import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';

export interface DecorationInterface {
  group: DecoratorGroupEnum;

  onAttach?<T, P>(decorator: DecoratorType<T, P>, decoration?: DecorationType<P>): any;
  onInitialize?<T, P>(decorator: DecoratorType<T, P>, decoration?: DecorationType<P>): any;
}
