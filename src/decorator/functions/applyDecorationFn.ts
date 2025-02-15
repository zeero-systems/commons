import type { ConstructorType } from '~/common/types.ts';
import type { DecorationInterface } from '~/decorator/interfaces.ts';
import type { DecorationFunctionType, DecorationType, DecoratorContextType, DecoratorType } from '~/decorator/types.ts';

import Metadata from '~/decorator/services/Metadata.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';

import getParameterNamesFn from '~/common/functions/getParameterNamesFn.ts';

export const applyDecorationFn = <T extends DecorationInterface, P>(Decoration: ConstructorType<T>, decorationParameters?: P): ((target: any, context: DecoratorContextType<T, P>) => any) => {
  return function <T>(target: T, context: DecoratorContextType<T, P>) {
    // @ts-ignore targets can have name or not
    const targetName = target?.name || target?.constructor?.name || '';
    const targetParameters = target ? getParameterNamesFn(target, 'constructor') : [];
    const targetProperty = context.kind != DecoratorKindEnum.CLASS ? context.name : 'constructor';

    const decoration: DecorationType<P> = {
      target: new Decoration(),
      parameters: decorationParameters,
    };

    Metadata.addDecorator<T, P>(context as any, targetProperty, decoration);

    const decorator: DecoratorType<T, P> = {
      target,
      targetName,
      targetParameters,
      context,
    };

    if (decoration.target.onInitialize) {
      context.addInitializer(function (this: any) {
        if (decoration.target.onInitialize) {
          return decoration.target.onInitialize<T, P>({ ...decorator, target: this }, decoration);
        }

        return undefined;
      });
    }

    if (decoration.target.onAttach) {
      return decoration.target.onAttach<T, P>(decorator, decoration) ?? undefined;
    }

    return undefined;
  };
};

export default applyDecorationFn;
