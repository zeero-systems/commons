import type { AnnotationInterface } from '~/decorator/interfaces.ts';
import type { ValidationInterface } from '~/validator/interfaces.ts';
import type { AcceptType, ArtifactType } from '~/common/types.ts';
import type { DecoratorType } from '~/decorator/types.ts';

import ValidationEnum from '~/validator/enums/validation.enum.ts';

import isNull from '~/common/guards/is-null.guard.ts';
import isUndefined from '~/common/guards/is-undefined.guard.ts';
import isNumber from '~/common/guards/is-number.guard.ts';
import isString from '~/common/guards/is-string.guard.ts';

export class Float implements AnnotationInterface, ValidationInterface {
  accepts?: AcceptType[] | undefined = [
    isNull,
    isUndefined,
    isNumber,
    isString,
  ];

  validations? = [
    (record: any): boolean => isNull(record),
    (record: any): boolean => isUndefined(record),
    (record: any): boolean => isString(record) && !Number.isInteger(Number(record)) && !Number.isNaN(parseFloat(record)),
    (record: any): boolean => isNumber(record) && !Number.isInteger(record) && !Number.isNaN(record),
  ];

  onAttach(_artifact: ArtifactType, _decorator: DecoratorType) { }

  onInitialize(_artifact: ArtifactType, _decorator: DecoratorType) { }

  onValidation(record: any): Promise<ValidationEnum> {
    if (this.validations?.some(v => v(record) === true)) {
      return Promise.resolve(ValidationEnum.VALID);
    }
    return Promise.resolve(ValidationEnum.INVALID);
  }
}

export default Float;
