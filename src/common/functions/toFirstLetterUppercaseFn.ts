export const toFirstLetterToUppercaseFn = function (text?: string | symbol | string): string {
  return `${String(text).charAt(0).toUpperCase()}${String(text).slice(1)}`;
};

export default toFirstLetterToUppercaseFn;
