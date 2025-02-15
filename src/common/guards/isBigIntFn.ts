export const isBigIntFn = (x: unknown): x is bigint => {
  return typeof x === 'bigint';
};

export default isBigIntFn;
