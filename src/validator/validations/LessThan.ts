import type { AcceptType } from '~/common/types.ts';
import type { ValidationInterface } from '~/validator/interfaces.ts';

import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import isNull from '~/common/guards/isNull.ts';
import isUndefined from '~/common/guards/isUndefined.ts';
import isArray from '~/common/guards/isArray.ts';
import isString from '~/common/guards/isString.ts';
import isNumber from '~/common/guards/isNumber.ts';
import isDate from '~/common/guards/isDate.ts';

export class LessThan implements ValidationInterface {
  accepts?: AcceptType[] | undefined = [
    isNull,
    isUndefined,
    isArray,
    isString,
    isNumber,
    isDate
  ]
  
  validations = [
    (record: any, _comparison: any) => isNull(record),
    (record: any, _comparison: any) => isUndefined(record),
    (record: any, comparison: any) => isArray(record) && record.length < Number(comparison),
    (record: any, comparison: any) => isString(record) && isNumber(comparison) && record.length < Number(comparison),
    (record: any, comparison: any) => isString(record) && isString(comparison) && record < String(comparison),
    (record: any, comparison: any) => isNumber(record) && record < Number(comparison),
    (record: any, comparison: any) => isDate(record) && isDate(comparison) && record < comparison,
    (record: any, comparison: any) => isDate(record) && record < new Date(comparison),
  ]

  onValidation(record: any, comparison: any): Promise<ValidationEnum> {
  
    if (this.validations.some(v => v(record, comparison) == true)) { 
      return Promise.resolve(ValidationEnum.VALID)
    }

    return Promise.resolve(ValidationEnum.INVALID)
  }
}

export default LessThan