import type { AcceptType } from '~/common/types.ts';
import type { ValidationInterface } from '~/validator/interfaces.ts';

import ValidationEnum from '~/validator/enums/validation.enum.ts';

import isNull from '~/common/guards/is-null.guard.ts';
import isUndefined from '~/common/guards/is-undefined.guard.ts';
import isArray from '~/common/guards/is-array.guard.ts';
import isString from '~/common/guards/is-string.guard.ts';
import isNumber from '~/common/guards/is-number.guard.ts';
import isDate from '~/common/guards/is-date.guard.ts';

export class Equal implements ValidationInterface {
  accepts?: AcceptType[] | undefined = [
    isNull,
    isUndefined,
    isArray,
    isString,
    isNumber,
    isDate
  ]
  
  validations = [
    (record: any, _comparison: any): boolean => isNull(record),
    (record: any, _comparison: any): boolean => isUndefined(record),
    (record: any, comparison: any): boolean => isArray(record) && isNumber(comparison) && record.length === comparison,
    (record: any, comparison: any): boolean => isArray(record) && isArray(comparison) && record === comparison,
    (record: any, comparison: any): boolean => isNumber(record) && isNumber(comparison) && record === comparison,
    (record: any, comparison: any): boolean => isString(record) && isNumber(comparison) && record.length === comparison,
    (record: any, comparison: any): boolean => isString(record) && isString(comparison) && record === comparison,
    (record: any, comparison: any): boolean => isNumber(record) && isNumber(comparison) && record === comparison,
    (record: any, comparison: any): boolean => isDate(record) && isDate(comparison) && record === comparison,
    (record: any, comparison: any): boolean => isDate(record) && record === new Date(comparison),
  ]

  onValidation(record: any, comparison: any): Promise<ValidationEnum> {
    
    if (this.validations.some(v => v(record, comparison) == true)) { 
      return Promise.resolve(ValidationEnum.VALID)
    }

    return Promise.resolve(ValidationEnum.INVALID)
  }
}

export default Equal