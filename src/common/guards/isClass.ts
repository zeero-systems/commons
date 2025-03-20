export const isClass = <T>(x: unknown): x is new (...args: any[]) => T => {
  return typeof x === 'function' && !!x.prototype
};

export default isClass;
