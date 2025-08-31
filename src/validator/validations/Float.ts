import type { AcceptType } from '~/common/types.ts';
import type { ValidationInterface } from '~/validator/interfaces.ts';

import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import isNull from '~/common/guards/isNull.ts';
import isUndefined from '~/common/guards/isUndefined.ts';
import isNumber from '~/common/guards/isNumber.ts';
import isString from '~/common/guards/isString.ts';

export class Float implements ValidationInterface {
  accepts?: AcceptType[] | undefined = [
    isNull,
    isUndefined,
    isNumber,
    isString,
  ];

  validations = [
    (record: any): boolean => isNull(record),
    (record: any): boolean => isUndefined(record),
    (record: any): boolean => isString(record) && !Number.isInteger(Number(record)) && !Number.isNaN(parseFloat(record)),
    (record: any): boolean => isNumber(record) && !Number.isInteger(record) && !Number.isNaN(record),
  ];

  onValidation(record: any): Promise<ValidationEnum> {
    if (this.validations.some(v => v(record) === true)) {
      return Promise.resolve(ValidationEnum.VALID);
    }
    return Promise.resolve(ValidationEnum.INVALID);
  }
}

export default Float;