export const isWeakSetFn = <T extends object>(x: unknown): x is WeakSet<T> => {
  return x instanceof WeakSet;
};

export default isWeakSetFn;
