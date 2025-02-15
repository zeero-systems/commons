export const isFunctionFn = <T>(x: unknown): x is T => {
  return typeof x === 'function';
};

export default isFunctionFn;
