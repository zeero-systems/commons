export const isSetFn = <T>(x: unknown): x is Set<T> => {
  return x instanceof Set;
};

export default isSetFn;
