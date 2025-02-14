import type { ModuleParametersType } from '~/module/types.ts';
import type { DecorationInterface } from '~/decorator/interfaces.ts';
import type { DecorationType, DecoratorType } from '~/decorator/types.ts';

import DecoratorException from '~/decorator/exceptions/DecoratorException.ts';
import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';

import applyDecorationFn from '~/decorator/functions/applyDecorationFn.ts';
import applySingletonProxyFn from '~/common/functions/applySingletonProxyFn.ts';
import applyConsumerProxyFn from '~/provider/functions/applyConsumerProxyFn.ts';
import applyModuleProxyFn from '~/module/functions/applyModuleProxyFn.ts';

export class Module implements DecorationInterface {
  group: DecoratorGroupEnum = DecoratorGroupEnum.MODULES;

  onAttach<T, P>(decorator: DecoratorType<T, P>, decoration?: DecorationType<P & ModuleParametersType>) {
    if (decorator.context.kind == DecoratorKindEnum.CLASS) {
      return applyModuleProxyFn(...applyConsumerProxyFn(...applySingletonProxyFn(decorator, decoration)))[0].target;
    }

    throw new DecoratorException('Method not implemented for {name} on {kind}.', {
      key: 'NOT_IMPLEMENTED',
      context: { name: decorator.targetName, kind: decorator.context.kind },
    });
  }
}

export default (parameters?: ModuleParametersType) => applyDecorationFn(Module, parameters);
