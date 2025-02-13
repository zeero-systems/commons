export const guardObjectFn = (x: unknown): x is { [key: string | number | symbol]: any} => {
  return typeof x === 'object';
};

export default guardObjectFn;
