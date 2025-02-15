export const isBooleanFn = (x: unknown): x is boolean => {
  return typeof x === 'boolean';
};

export default isBooleanFn;
