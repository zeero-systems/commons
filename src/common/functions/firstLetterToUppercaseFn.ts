
export const firstLetterToUppercaseFn = (value: string | symbol) => {
  const firstLetter = String(value).charAt(0).toUpperCase()
  return `${firstLetter}${String(value).slice(1)}`
}

export default firstLetterToUppercaseFn

