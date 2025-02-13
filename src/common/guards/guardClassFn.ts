export const guardClassFn = <T>(x: unknown): x is new (...args: any[]) => T => {
  return typeof x === 'function' && !!x.prototype && x.prototype.constructor === x;
};

export default guardClassFn;

