import type { DecorationType, DecoratorType } from '~/decorator/types.ts';
import type { ProviderType } from '~/provider/types.ts';

import Metadata from '~/decorator/services/Metadata.ts';
import MetadataTagEnum from '~/common/enums/MetadataTagEnum.ts';
import Provider from '~/provider/services/Provider.ts';
import toFirstLetterToUppercaseFn from '~/common/functions/toFirstLetterUppercaseFn.ts';

export const applyProviderProxyFn = <T extends ProviderType, P>(decorator: DecoratorType<T, P>, decoration?: DecorationType<P>): [DecoratorType<T, P>, DecorationType<any> | undefined] => {
  
  const context = decorator.context as any

  if (!Metadata.hasTag<T, P>(context, MetadataTagEnum.PROVIDER)) {
    Metadata.applyTag<T, P>(context, MetadataTagEnum.PROVIDER)
    Provider.set(decorator.target, toFirstLetterToUppercaseFn(decorator.targetName))
  }

  return [decorator, decoration]

};

export default applyProviderProxyFn;
