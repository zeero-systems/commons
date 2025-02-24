import type { ValidationInterface } from '~/validator/interfaces.ts';
import type { GuardType } from '~/common/types.ts';

import Singleton from '~/common/annotations/Singleton.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import isNullFn from '~/common/guards/isNullFn.ts';
import isUndefinedFn from '~/common/guards/isUndefinedFn.ts';
import isStringFn from '~/common/guards/isStringFn.ts';
import isDateFn from '~/common/guards/isDateFn.ts';

@Singleton()
export class Required implements ValidationInterface {
  guards?: GuardType[] | undefined = [
    isNullFn,
    isUndefinedFn,
    isStringFn,
    isDateFn,
  ]

  onValidation(record: any): ValidationEnum {
    if ([
      !isStringFn(record) && !isNullFn(record) && !isUndefinedFn(record),
      isStringFn(record) && !!record
    ].some(r => r == true)) { 
      return ValidationEnum.VALID
    }

    return ValidationEnum.INVALID;
  }
}

export default Required