export const isUndefinedFn = (x: unknown): x is undefined => {
  return typeof x === 'undefined';
};

export default isUndefinedFn;
