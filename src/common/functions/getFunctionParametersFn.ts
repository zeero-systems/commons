
export const getFunctionParametersFn = (target: any, fnName?: string) => {
  const match = target.toString().match(`${fnName ? fnName : target.name}\\((.+)\\)`);
  
  if(match && match[1]) {
    return match[1].split(',').map((m: any) => String(m).trim());
  }

  return [];
}

export default getFunctionParametersFn