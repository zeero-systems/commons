import type { ValidationInterface } from '~/validator/interfaces.ts';

export const isValidationFn = (x: any): x is ValidationInterface => {
  return x && x.onValidation;
};
export default isValidationFn;
