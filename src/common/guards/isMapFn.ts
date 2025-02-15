export const isMapFn = <K, V>(x: unknown): x is Map<K, V> => {
  return x instanceof Map;
};

export default isMapFn;
