export const isSymbol = (x: unknown): x is symbol => {
  return typeof x === 'symbol';
};

export default isSymbol;
