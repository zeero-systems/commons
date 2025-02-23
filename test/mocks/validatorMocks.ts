import type { ValidationInterface } from '~/validator/interfaces.ts';

import Singleton from '~/common/annotations/Singleton.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import isNullFn from '~/common/guards/isNullFn.ts';
import isUndefinedFn from '~/common/guards/isUndefinedFn.ts';

@Singleton()
export class Required implements ValidationInterface {
  onValidation(record: any, _parameters: {}): ValidationEnum {
    if (!isNullFn(record) && !isUndefinedFn(record)) {
      return ValidationEnum.VALID;
    }

    return ValidationEnum.INVALID;
  }
}