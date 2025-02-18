import type { ConstructorType } from '~/common/types.ts';
import type { DecorationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorContextType, DecoratorType } from '~/decorator/types.ts';

import Metadata from '~/decorator/services/Metadata.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';

import parameterNamesFn from '~/common/functions/parameterNamesFn.ts';
import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';

export const decorateFn = <T extends DecorationInterface, P>(Decoration: ConstructorType<T>, decorationParameters?: P): ((target: any, context: DecoratorContextType<T, P>) => any) => {
  return function <T extends { name?: string }>(target: T, context: DecoratorContextType<T, P>) {    
    const targetName = target?.name || target?.constructor?.name || '';
    const targetParameters = target ? parameterNamesFn(target, 'constructor') : [];
    const targetProperty = context.kind != DecoratorKindEnum.CLASS ? context.name : 'constructor';

    const decoration: DecorationType<P> = {
      target: new Decoration(),
      parameters: decorationParameters,
    };

    if (decoration.target.group != DecoratorGroupEnum.HIDDEN) {
      Metadata.addDecorator<T, P>(context as any, targetProperty, decoration);
    }

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

export default decorateFn;
