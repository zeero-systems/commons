import type { ValidationInterface } from '~/validator/interfaces.ts';
import type { GuardType } from '~/common/types.ts';

import Singleton from '~/common/annotations/Singleton.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import isNull from '~/common/guards/isNull.ts';
import isUndefined from '~/common/guards/isUndefined.ts';
import isString from '~/common/guards/isString.ts';
import isDate from '~/common/guards/isDate.ts';

@Singleton()
export class Required implements ValidationInterface {
  guards?: GuardType[] | undefined = [
    isNull,
    isUndefined,
    isString,
    isDate,
  ]

  onValidation(record: any): ValidationEnum {
    if ([
      !isString(record) && !isNull(record) && !isUndefined(record),
      isString(record) && !!record
    ].some(r => r == true)) { 
      return ValidationEnum.VALID
    }

    return ValidationEnum.INVALID;
  }
}

export default Required