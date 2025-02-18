// deno-lint-ignore-file ban-types
import type { ValidationResultType } from '~/validator/types.ts';
import type { ValidationInterface } from '~/validator/interfaces.ts';
import type { EntryType, MappedType, OmitType } from '~/common/types.ts';

import validateValueFn from '~/validator/functions/validateValueFn.ts';
import objectEntriesFn from '~/common/functions/objectEntriesFn.ts';

export const validateObjectFn = <T extends {}>(
  target: T,
  validators: { [key: string | symbol]: Array<{ validation: ValidationInterface; parameters?: unknown[] }> },
) => {
  return objectEntriesFn(target).reduce((previous, [key, value]: EntryType<T>) => {
    return { ...previous, [key]: [...validateValueFn(value, validators[key])] };
  }, {} as MappedType<OmitType<T, Function>, Array<ValidationResultType>>);
};

export default validateObjectFn;
