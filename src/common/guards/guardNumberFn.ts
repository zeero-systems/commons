export const guardNumberFn = (x: unknown): x is number => {
  return typeof x === 'number';
};

export default guardNumberFn;
