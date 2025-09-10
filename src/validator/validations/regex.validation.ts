import type { ValidationInterface } from '~/validator/interfaces.ts';
import type { AcceptType, ArtifactType } from '~/common/types.ts';
import type { DecoratorType } from '~/decorator/types.ts';

import ValidationEnum from '~/validator/enums/validation.enum.ts';

import isNull from '~/common/guards/is-null.guard.ts';
import isUndefined from '~/common/guards/is-undefined.guard.ts';
import isString from '~/common/guards/is-string.guard.ts';

export class RegexValidation implements ValidationInterface {
  name?: string | undefined = 'Regex'

  accepts?: AcceptType[] | undefined = [
    isNull,
    isUndefined,
    isString
  ]
  
  validations? = [
    (record: string, _expression: RegExp): boolean => isNull(record),
    (record: string, _expression: RegExp): boolean => isUndefined(record),
    (record: string, expression: RegExp): boolean => isString(record) && expression.test(record),
  ]
  
  constructor(public pattern: string | RegExp) {}
  
  onAttach(_artifact: ArtifactType, _decorator: DecoratorType) { }
  
  onInitialize(_artifact: ArtifactType, _decorator: DecoratorType) { }

  onValidation(record: string): Promise<ValidationEnum> {
    
    const expression = new RegExp(this.pattern)

    if (this.validations?.some(v => v(record, expression) == true)) { 
      return Promise.resolve(ValidationEnum.VALID)
    }
      

    return Promise.resolve(ValidationEnum.INVALID)
  }
}

export default RegexValidation
