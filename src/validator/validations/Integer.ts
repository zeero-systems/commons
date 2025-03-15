import type { GuardType } from '~/common/types.ts';
import type { ValidationInterface } from '~/validator/interfaces.ts';

import Singleton from '~/common/annotations/Singleton.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import isNull from '~/common/guards/isNull.ts';
import isUndefined from '~/common/guards/isUndefined.ts';
import isNumber from '~/common/guards/isNumber.ts';

@Singleton()
export class Integer implements ValidationInterface {
  guards?: GuardType[] | undefined = [
    isNull,
    isUndefined,
    isNumber
  ]
  
  onValidation(record: any): ValidationEnum {
  
    if ([
      isNull(record),
      isUndefined(record),
      isNumber(record) && Number.isInteger(record) 
    ].some(r => r == true)) { 
      return ValidationEnum.VALID
    }

    return ValidationEnum.INVALID
  }
}

export default Integer