export const guardPropertyDescriptorFn = (
  target: object,
  property: string | symbol,
  _propertDescriptor: PropertyDescriptor,
): _propertDescriptor is PropertyDescriptor => {
  return !!Object.getOwnPropertyDescriptor(target, property);
};

export default guardPropertyDescriptorFn;
