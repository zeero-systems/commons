
export class Text {
  public static toFirstLetterUppercase(text?: string | symbol | string): string {
    return `${String(text).charAt(0).toUpperCase()}${String(text).slice(1)}`;
  }
}

export default Text