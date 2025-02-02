
export const firstLetterToUppercaseFn = function (text?: string | symbol | String) {
  if (!text) {
    text = String(this)
  } else {
    text = String(text)
  }
  
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`
}

export default firstLetterToUppercaseFn

