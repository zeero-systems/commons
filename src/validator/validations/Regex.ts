import type { GuardType } from '~/common/types.ts';
import type { ValidationInterface } from '~/validator/interfaces.ts';

import Singleton from '~/common/annotations/Singleton.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import isNullFn from '~/common/guards/isNullFn.ts';
import isUndefinedFn from '~/common/guards/isUndefinedFn.ts';
import isStringFn from '~/common/guards/isStringFn.ts';

@Singleton()
export class Regex implements ValidationInterface {
  guards?: GuardType[] | undefined = [
    isNullFn,
    isUndefinedFn,
    isStringFn
  ]
  
  onValidation(record: string, pattern: string | RegExp): ValidationEnum {
  
    const expression = new RegExp(pattern)

    if ([
      isNullFn,
      isUndefinedFn,
      isStringFn(record) && expression.test(record),
    ].some(r => r == true)) { 
      return ValidationEnum.VALID
    }
      

    return ValidationEnum.INVALID
  }
}

export default Regex