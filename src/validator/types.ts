import ValidationEnum from '~/validator/enums/ValidationEnum.ts';
import { ValidationInterface } from '~/validator/interfaces.ts';

export type ValidationType = {
  target: ValidationInterface
  parameters?: unknown[]
}

export type ValidationResultType = {
  key: ValidationEnum
  name: string
  parameters?: unknown[]
}
