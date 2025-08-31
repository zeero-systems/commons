import type { ValidationInterface } from '~/validator/interfaces.ts';
import type { AcceptType } from '~/common/types.ts';

import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import isNull from '~/common/guards/isNull.ts';
import isUndefined from '~/common/guards/isUndefined.ts';
import isString from '~/common/guards/isString.ts';
import isDate from '~/common/guards/isDate.ts';

export class Required implements ValidationInterface {
  accepts?: AcceptType[] | undefined = [
    isNull,
    isUndefined,
    isString,
    isDate,
  ]

  validations = [
    (record: any): boolean => !isString(record) && !isNull(record) && !isUndefined(record),
    (record: any): boolean => isString(record) && !!record
  ]

  onValidation(record: any): Promise<ValidationEnum> {
    if (this.validations.some(v => v(record) == true)) { 
      return Promise.resolve(ValidationEnum.VALID);
    }

    return Promise.resolve(ValidationEnum.INVALID);
  }
}

export default Required