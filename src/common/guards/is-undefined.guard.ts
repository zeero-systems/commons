export const isUndefined = (x: unknown): x is undefined => {
  return typeof x === 'undefined';
};

export default isUndefined;
