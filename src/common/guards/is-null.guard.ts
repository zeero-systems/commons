export const isNull = (x: unknown): x is null => {
  return x === null;
};

export default isNull;
