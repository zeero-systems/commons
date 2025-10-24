/**
 * Common operations to strings
 *
 * @param {string} toFirstLetterUppercase - Return the string with his first letter upcased
 */
export class Text {
  public static toFirstLetterUppercase(text?: string | number | symbol): string {
    return `${String(text).charAt(0).toUpperCase()}${String(text).slice(1)}`;
  }
  public static toSnakecase(text?: string | number | symbol): string {
    return String(text).replace(/([A-Z])/g, '_$1').toLowerCase();
  }
  public static toCamelcase(text?: string | number | symbol): string {
    return String(text).replace(/[^a-zA-Z0-9]+(.)?/g, (_match, chr) => chr ? chr.toUpperCase() : '').replace(
      /^./,
      (match) => match.toLowerCase(),
    );
  }
  public static getNextLetter(letter?: string): string {
    if (!letter) {
      return 'a';
    }

    const chars = letter.split('');
    let i = chars.length - 1;

    while (i >= 0) {
      const charCode = chars[i].charCodeAt(0);

      if (charCode === 'Z'.charCodeAt(0)) {
        chars[i] = 'A';
        i--;
      } else {
        chars[i] = String.fromCharCode(charCode + 1);
        return chars.join('');
      }
    }

    return 'a' + chars.join('').toLowerCase();
  }
}

export default Text;
