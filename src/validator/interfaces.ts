import type { GuardType } from '~/common/types.ts';

import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

export interface ValidationInterface {
  guards: Array<GuardType>;
  onValidation(record: any, ...parameters: any[]): ValidationEnum;
}

export default {};