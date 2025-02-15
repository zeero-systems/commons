import type { ValidationInterface } from '~/validator/interfaces.ts';

import Singleton from '~/common/decorations/Singleton.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import isNullFn from '~/common/guards/isNullFn.ts';
import isUndefinedFn from '~/common/guards/isUndefinedFn.ts';

@Singleton()
export class Required implements ValidationInterface {
  guards = [
    isNullFn,
    isUndefinedFn,
  ];

  onValidation(record: string | number | null | undefined, _parameters: {}): ValidationEnum {
    if (!isNullFn(record) && !isUndefinedFn(record)) {
      return ValidationEnum.VALID;
    }

    return ValidationEnum.INVALID;
  }
}

export default Required;
