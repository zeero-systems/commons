import toFirstLetterUppercaseFn from "./functions/toFirstLetterUppercaseFn"

declare global {
  interface String {
    toFirstLetterUppercase(this: string): string;
  }
}

String.prototype.toFirstLetterUppercase = toFirstLetterUppercaseFn

export default {}