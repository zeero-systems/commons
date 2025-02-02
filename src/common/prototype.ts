import toFirstLetterUppercaseFn from "./functions/toFirstLetterUppercaseFn"

declare global {
  interface String {
    toFirstLetterUppercase(): string;
  }
}

String.prototype.toFirstLetterUppercase = function () { 
  return toFirstLetterUppercaseFn(this)
}

export default {}