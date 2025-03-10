import isNull from '~/common/guards/isNull.ts';

export const isObject = <T extends object, U>(x: T | U): x is NonNullable<T> => {
  return !isNull(x) && typeof x === 'object';
};

export default isObject;