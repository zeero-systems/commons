export const isBoolean = (x: unknown): x is boolean => {
  return typeof x === 'boolean';
};

export default isBoolean;
