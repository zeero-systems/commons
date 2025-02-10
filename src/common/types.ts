// deno-lint-ignore ban-types
export type ArgType<T> = OmitType<T, object | Function> & Partial<PickType<T, object>>;
export type ConstructorType<T> = T extends new (...args: infer A) => infer R ? new (...args: A) => R : new (...args: any) => any;
// deno-lint-ignore ban-types
export type EntryType<T extends {}> = T extends readonly [unknown, ...unknown[]] ? TupleEntryType<T>
	: T extends ReadonlyArray<infer U> ? [`${number}`, U]
	: T extends object
		? { [K in keyof T]: [K, Required<T>[K]] }[keyof T] extends infer E
			? E extends [infer K, infer V] ? K extends string | number ? [`${K}`, V]
				: never
			: never
		: never
	: never;
export type GuardType = (record: any) => boolean;
export type JsonType =
	| string
	| number
	| boolean
	| null
	| undefined
	| object
	| readonly JsonType[]
	| { readonly [key: string]: JsonType }
	| { toJSON(): JsonType };
export type MappedKeyType<T> = { [K in keyof T]: T[K] };
export type MappedType<T, V> = { [K in keyof T]: V };
export type OmitType<T, R> = { [P in keyof T as T[P] extends R ? never : P]: T[P] };
export type PickType<T, R> = { [P in keyof T as T[P] extends R ? P : never]: T[P] };
export type TupleEntryType<T extends readonly unknown[], I extends unknown[] = [], R = never> = T extends
	readonly [infer Head, ...infer Tail] ? TupleEntryType<Tail, [...I, unknown], R | [`${I['length']}`, Head]>
	: R;
