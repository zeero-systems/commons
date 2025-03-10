import type { ValidationInterface } from '~/validator/interfaces.ts';

export const isValidation = (x: any): x is ValidationInterface => {
  return x && x.onValidation;
};
export default isValidation;
