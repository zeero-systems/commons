export const isSet = <T>(x: unknown): x is Set<T> => {
  return x instanceof Set;
};

export default isSet;
