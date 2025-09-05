import type { AcceptType } from '~/common/types.ts';
import type { ValidationInterface } from '~/validator/interfaces.ts';

import ValidationEnum from '~/validator/enums/validation.enum.ts';

import isNull from '~/common/guards/is-null.guard.ts';
import isUndefined from '~/common/guards/is-undefined.guard.ts';
import isString from '~/common/guards/is-string.guard.ts';

export class Regex implements ValidationInterface {
  accepts?: AcceptType[] | undefined = [
    isNull,
    isUndefined,
    isString
  ]
  
  validations = [
    (record: string, _expression: RegExp): boolean => isNull(record),
    (record: string, _expression: RegExp): boolean => isUndefined(record),
    (record: string, expression: RegExp): boolean => isString(record) && expression.test(record),
  ]

  onValidation(record: string, pattern: string | RegExp): Promise<ValidationEnum> {
  
    const expression = new RegExp(pattern)

    if (this.validations.some(v => v(record, expression) == true)) { 
      return Promise.resolve(ValidationEnum.VALID)
    }
      

    return Promise.resolve(ValidationEnum.INVALID)
  }
}

export default Regex