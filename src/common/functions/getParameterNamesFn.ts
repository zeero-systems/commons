export const getParameterNamesFn = function (target: any, fnName?: string) {
  const regex = `${fnName != undefined ? fnName : target.prototype ? target.name : ''}\\((.+)\\)`;
  const match = target.toString().match(regex);

  if (match && match[1]) {
    return match[1].split(',').map((m: any) => String(m).trim());
  }

  return [];
};

export default getParameterNamesFn;
