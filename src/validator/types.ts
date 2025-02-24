import type { ValidationInterface } from '~/validator/interfaces.ts';

import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

export type ValidationType = {
  target: ValidationInterface;
  parameters?: unknown[];
};

export type ValidationResultType = {
  key: ValidationEnum;
  name: string;
  parameters?: unknown;
};

export default {};