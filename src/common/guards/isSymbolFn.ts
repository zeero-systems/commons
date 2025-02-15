export const isSymbolFn = (x: unknown): x is symbol => {
  return typeof x === 'symbol';
};

export default isSymbolFn;
