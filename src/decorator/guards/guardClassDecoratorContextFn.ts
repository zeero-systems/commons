export const guardClassDecoratorContextFn = (context: any): context is ClassDecoratorContext => {
	return typeof context.private === 'undefined' && typeof context.static === 'undefined';
};

export default guardClassDecoratorContextFn;
