import DecorationInterface from 'packages/decorator/interfaces/DecorationInterface.ts';
import DecorationType from 'packages/decorator/types/DecorationType.ts';
import DecoratorType from 'packages/decorator/types/DecoratorType.ts';
import DecoratorException from 'packages/decorator/exceptions/DecoratorException.ts';
import ModuleArgumentsType from 'packages/module/types/ModuleArgumentsType.ts';
import KindEnum from 'packages/decorator/enums/KindEnum.ts';

import decorateFn from 'packages/decorator/functions/decorateFn.ts';
import moduleProxyFn from 'packages/module/functions/moduleProxyFn.ts';

type ParamsType = ModuleArgumentsType;

export class Module implements DecorationInterface {
  onAttach<T, P>(decorator: DecoratorType<T, P>, decoration: DecorationType<P>) {
    
    if (decorator.context.kind == KindEnum.CLASS) {
      return moduleProxyFn(decorator, decoration)
    }

    throw new DecoratorException('Kind on attach not implemented', { key: 'NOT_IMPLEMENTED', context: { decorator, decoration } });
  }
}

export default (parameters?: ParamsType) => decorateFn(Module, parameters);
