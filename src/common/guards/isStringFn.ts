export const isStringFn = (x: unknown): x is string => {
  return typeof x === 'string';
};

export default isStringFn;
