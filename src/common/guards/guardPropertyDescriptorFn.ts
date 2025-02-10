
export const guardPropertyDescriptorFn = (target: object, property: string | symbol, propertDescriptor: PropertyDescriptor): propertDescriptor is PropertyDescriptor => {
  return !!Object.getOwnPropertyDescriptor(target, property)
}

export default guardPropertyDescriptorFn
