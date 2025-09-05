export const isBigInt = (x: unknown): x is bigint => {
  return typeof x === 'bigint';
};

export default isBigInt;
