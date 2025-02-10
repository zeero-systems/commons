export const guardStringFn = (x: unknown): x is string => {
	return typeof x === 'string';
};

export default guardStringFn;
