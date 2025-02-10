export const guardBooleanFn = (x: unknown): x is boolean => {
	return typeof x === 'boolean';
};

export default guardBooleanFn;
