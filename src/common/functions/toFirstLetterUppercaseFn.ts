
export const firstLetterToUppercaseFn = function (text?: string | symbol | String) {
  if (!text) text = String(this)
  
  const firstLetter = String(text).charAt(0).toUpperCase()
  return `${firstLetter}${String(text).slice(1)}`
}

export default firstLetterToUppercaseFn

