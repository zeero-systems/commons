import type { GuardType } from '~/common/types.ts';
import type { ValidationInterface } from '~/validator/interfaces.ts';

import Singleton from '~/common/annotations/Singleton.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import isNull from '~/common/guards/isNull.ts';
import isUndefined from '~/common/guards/isUndefined.ts';
import isArray from '~/common/guards/isArray.ts';
import isString from '~/common/guards/isString.ts';
import isNumber from '~/common/guards/isNumber.ts';
import isDate from '~/common/guards/isDate.ts';

@Singleton()
export class LessThan implements ValidationInterface {
  guards?: GuardType[] | undefined = [
    isNull,
    isUndefined,
    isArray,
    isString,
    isNumber,
    isDate
  ]
  
  onValidation(record: any, comparison: any): ValidationEnum {
  
    if ([
      isNull(record),
      isUndefined(record),
      isArray(record) && record.length < Number(comparison),
      isString(record) && isNumber(comparison) && record.length < Number(comparison),
      isString(record) && isString(comparison) && record < String(comparison),
      isNumber(record) && record < Number(comparison),
      isDate(record) && isDate(comparison) && record < comparison,
      isDate(record) && record < new Date(comparison),
    ].some(r => r == true)) { 
      return ValidationEnum.VALID
    }

    return ValidationEnum.INVALID
  }
}

export default LessThan