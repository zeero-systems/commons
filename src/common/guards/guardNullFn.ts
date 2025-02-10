
export const guardNullFn = (x: unknown): x is null => {
  return x === null
}

export default guardNullFn
