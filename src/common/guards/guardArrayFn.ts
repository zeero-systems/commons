
export const guardArrayFn = (x: any): x is Array<any> => {
  return x && Array.isArray(x)
}
export default guardArrayFn
