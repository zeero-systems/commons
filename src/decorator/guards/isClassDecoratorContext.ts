export const isClassDecoratorContext = (context: any): context is ClassDecoratorContext => {
  return typeof context.private === 'undefined' && typeof context.static === 'undefined';
};

export default isClassDecoratorContext;
