import type { PropertiesType } from '~/common/types.ts';
import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { DecoratorFunctionType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';

export const Use = <T extends AnnotationInterface, C extends (...args: any) => T>(annotation: new (...args: any) => T, parameters?: PropertiesType<T> | Parameters<C>): DecoratorFunctionType => {
  return Decorator.use(annotation as any, parameters)
}

export default Use
