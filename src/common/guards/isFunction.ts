export const isFunction = <T>(x: unknown): x is T => {
  return typeof x === 'function';
};

export default isFunction;
