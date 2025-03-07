import type { GuardType } from '~/common/types.ts';
import type { AnnotationInterface } from '~/decorator/interfaces.ts';

import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

/**
 * Validate a value and value type
 * Can also be attached to decoration context
 * 
 * @interface ValidationInterface
 *
 * @member {Array<GuardType>} guards - A lista of safe type guards
 * @member {Function} onValidation - Called when validation occurs
 */
export interface ValidationInterface extends AnnotationInterface {
  guards?: Array<GuardType>;
  onValidation(record: any, ...parameters: any[]): ValidationEnum;
}

export default {};