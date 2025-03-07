import type { GuardType } from '~/common/types.ts';
import type { ValidationInterface } from '~/validator/interfaces.ts';

import Singleton from '~/common/annotations/Singleton.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import isNullFn from '~/common/guards/isNullFn.ts';
import isUndefinedFn from '~/common/guards/isUndefinedFn.ts';
import isArrayFn from '~/common/guards/isArrayFn.ts';
import isStringFn from '~/common/guards/isStringFn.ts';
import isNumberFn from '~/common/guards/isNumberFn.ts';
import isDateFn from '~/common/guards/isDateFn.ts';

@Singleton()
export class GreaterThan implements ValidationInterface {
  guards?: GuardType[] | undefined = [
    isNullFn,
    isUndefinedFn,
    isArrayFn,
    isStringFn,
    isNumberFn,
    isDateFn
  ]
  
  onValidation(record: any, comparison: any): ValidationEnum {
  
    if ([
      isNullFn(record),
      isUndefinedFn(record),
      isArrayFn(record) && record.length > Number(comparison),
      isStringFn(record) && isNumberFn(comparison) && record.length > Number(comparison),
      isStringFn(record) && isStringFn(comparison) && record > String(comparison),
      isNumberFn(record) && record > Number(comparison),
      isDateFn(record) && isDateFn(comparison) && record > comparison,
      isDateFn(record) && record > new Date(comparison),
    ].some(r => r == true)) { 
      return ValidationEnum.VALID
    }

    return ValidationEnum.INVALID
  }
}

export default GreaterThan