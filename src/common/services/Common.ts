
/**
 * Static Class that holds common symbols
 */ 
export class Common {
  public static readonly metadata: unique symbol = Symbol('Common.metadata')
  public static readonly singleton: unique symbol = Symbol('Common.singleton')
}

export default Common