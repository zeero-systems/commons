export const guardUndefinedFn = (x: unknown): x is undefined => {
  return typeof x === 'undefined';
};

export default guardUndefinedFn;
