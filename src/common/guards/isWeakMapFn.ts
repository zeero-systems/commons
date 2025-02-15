export const isWeakMapFn = <K extends object, V>(x: unknown): x is WeakMap<K, V> => {
  return x instanceof WeakMap;
};

export default isWeakMapFn;
