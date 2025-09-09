import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { ValidationInterface } from '~/validator/interfaces.ts';
import type { AcceptType, ArtifactType } from '~/common/types.ts';
import type { DecoratorType } from '~/decorator/types.ts';
import ValidationEnum from '~/validator/enums/validation.enum.ts';

import isNull from '~/common/guards/is-null.guard.ts';
import isUndefined from '~/common/guards/is-undefined.guard.ts';
import isString from '~/common/guards/is-string.guard.ts';
import isDate from '~/common/guards/is-date.guard.ts';

export class Required implements AnnotationInterface, ValidationInterface {
  accepts?: AcceptType[] | undefined = [
    isNull,
    isUndefined,
    isString,
    isDate,
  ]
  
  validations? = [
    (record: any): boolean => !isString(record) && !isNull(record) && !isUndefined(record),
    (record: any): boolean => isString(record) && !!record
  ]

  onAttach(_artifact: ArtifactType, _decorator: DecoratorType) { }
  
  onInitialize(_artifact: ArtifactType, _decorator: DecoratorType) { }

  onValidation(record: any): Promise<ValidationEnum> {
    if (this.validations?.some(v => v(record) == true)) { 
      return Promise.resolve(ValidationEnum.VALID);
    }

    return Promise.resolve(ValidationEnum.INVALID);
  }
}

export default Required
