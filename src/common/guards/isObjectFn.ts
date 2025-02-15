import isNullFn from '~/common/guards/isNullFn.ts';

export const isObjectFn = <T extends object, U>(x: T | U): x is NonNullable<T> => {
  return !isNullFn(x) && typeof x === 'object';
};

export default isObjectFn;