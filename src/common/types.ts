/**
 * Constructor Type
 *
 * @type ConstructorType<T>
 */ 
export type ConstructorType<T> = T extends new (...args: infer A) => infer R ? new (...args: A) => R
  : new (...args: any) => any;

/**
 * Constructor Arguments Type
 * 
 * Return a type omitting functions
 *
 * @type ConstructorArgType<T>
 */ 
// deno-lint-ignore ban-types
export type ConstructorArgType<T> = OmitType<T, object | Function> & Partial<PickType<T, object>>;

/**
 * Entry Type
 *
 * Maps a entry type
 * 
 * @type EntryType<T>
 */ 
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

/**
 * Guard Type
 *
 * Maps guard function types
 * 
 * @type GuardType
 */ 
export type GuardType = (record: any) => boolean;

/**
 * Json Type
 *
 * Maps a common json object
 * 
 * @type JsonType
 */ 
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

/**
 * MappedKey Type
 *
 * Maps key types of the object
 * 
 * @type MappedKeyType<T>
 */ 
export type MappedKeyType<T> = { [K in keyof T]: T[K] };

/**
 * Mapped Type
 * 
 * Maps to a diferent type of value
 *
 * @type MappedType<T, V>
 */ 
export type MappedType<T, V> = { [K in keyof T]: V };

/**
 * Metadata Type
 *
 * Define the default metadata object type
 * 
 * @type MetadaType
 */ 
export type MetadataType = { [key: string | symbol]: any };

/**
 * OmitType
 *
 * Omit and maps the key types of the object
 * 
 * @type OmitType<T, R>
 */ 
export type OmitType<T, R> = { [P in keyof T as T[P] extends R ? never : P]: T[P] };

/**
 * Pick Type
 *
 * Pick and maps the key types of the object
 * 
 * @type PickType
 */ 
export type PickType<T, R> = { [P in keyof T as T[P] extends R ? P : never]: T[P] };

/**
 * TargetProperty Type
 *
 * Define the possible types of the target property object
 * 
 * @type TargetPropertyType
 */ 
export type TargetPropertyType = string | number | symbol;

/**
 * TupleEntry Type
 *
 * Map a tuple entry type
 * 
 * @type TupleEntryType
 */ 
export type TupleEntryType<T extends readonly unknown[], I extends unknown[] = [], R = never> = T extends
  readonly [infer Head, ...infer Tail] ? TupleEntryType<Tail, [...I, unknown], R | [`${I['length']}`, Head]>
  : R;

export default {};
