import type { GuardType } from '~/common/types.ts';
import type { ValidationInterface } from '~/validator/interfaces.ts';

import Singleton from '~/common/annotations/Singleton.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import isNull from '~/common/guards/isNull.ts';
import isUndefined from '~/common/guards/isUndefined.ts';
import isString from '~/common/guards/isString.ts';

@Singleton()
export class Regex implements ValidationInterface {
  guards?: GuardType[] | undefined = [
    isNull,
    isUndefined,
    isString
  ]
  
  onValidation(record: string, pattern: string | RegExp): ValidationEnum {
  
    const expression = new RegExp(pattern)

    if ([
      isNull,
      isUndefined,
      isString(record) && expression.test(record),
    ].some(r => r == true)) { 
      return ValidationEnum.VALID
    }
      

    return ValidationEnum.INVALID
  }
}

export default Regex