import type { ValidationInterface } from '~/validator/interfaces.ts';

export const guardValidationFn = (x: any): x is ValidationInterface => {
  return x && x.onValidation;
};
export default guardValidationFn;
