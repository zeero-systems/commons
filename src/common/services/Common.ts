
/**
 * Static Class that holds common symbols
 */ 
export class Common {
  public static readonly debug: unique symbol = Symbol('DEBUG')
  public static readonly mixin: unique symbol = Symbol('MIXIN')
  public static readonly singleton: unique symbol = Symbol('SINGLETON')
}

export default Common