export const isClassMemberDecoratorContextFn = (context: any): context is ClassMemberDecoratorContext => {
  return typeof context.private == 'undefined' && typeof context.static == 'undefined';
};

export default isClassMemberDecoratorContextFn;
