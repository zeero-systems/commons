export const isNullFn = (x: unknown): x is null => {
  return x === null;
};

export default isNullFn;
