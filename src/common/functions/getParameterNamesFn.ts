
export const getParameterNamesFn = (target: any, fnName?: string) => {
  const regex = `${fnName ? fnName : target.name}\\((.+)\\)`
  const match = target.toString().match(regex);

  if(match && match[1]) {
    return match[1].split(',').map((m: any) => String(m).trim());
  }

  return [];
}

export default getParameterNamesFn