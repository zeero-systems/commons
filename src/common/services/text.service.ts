
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
    return String(text).replace(/([A-Z])/g, "_$1").toLowerCase();
  }
  public static toCamelcase(text?: string | number | symbol): string {
    return String(text).replace(/[^a-zA-Z0-9]+(.)?/g, (_match, chr) => chr ? chr.toUpperCase() : '').replace(/^./, (match) => match.toLowerCase());
  }
}

export default Text