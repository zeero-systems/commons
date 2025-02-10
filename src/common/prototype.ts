import toFirstLetterUppercaseFn from '~/common/functions/toFirstLetterUppercaseFn.ts';

declare global {
	interface String {
		toFirstLetterUppercase(this: string): string;
	}
}

String.prototype.toFirstLetterUppercase = function () {
	return toFirstLetterUppercaseFn(this);
};

export default {};
