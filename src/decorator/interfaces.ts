import type { DecorationType, DecoratorType } from '~/decorator/types.ts';

import ContextTagEnum from '~/decorator/enums/ContextTagEnum.ts';

export interface DecorationInterface {
  tag: ContextTagEnum;

  onAttach?<T, P>(decorator: DecoratorType<T, P>, decoration: DecorationType<P>): any;
  onInitialize?<T, P>(decorator: DecoratorType<T, P>, decoration: DecorationType<P>): any;
}
