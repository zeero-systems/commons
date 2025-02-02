import firstLetterToUppercaseFn from "./functions/firstLetterToUppercaseFn";

declare global {
  interface StringConstructor {
    firstLetterToUppercase(value: string): string;
  }
}

String.firstLetterToUppercase = firstLetterToUppercaseFn

export default String