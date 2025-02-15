export const isNumberFn = (x: unknown): x is number => {
  return typeof x === 'number' && !Number.isNaN(x);
};

export default isNumberFn;
