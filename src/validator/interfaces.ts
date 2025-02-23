import type { GuardType } from '~/common/types.ts';
import type { AnnotationInterface } from '~/decorator/interfaces.ts';

import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

export interface ValidationInterface extends AnnotationInterface {
  guards?: Array<GuardType>;
  onValidation(record: any, ...parameters: any[]): ValidationEnum;
}

export default {};