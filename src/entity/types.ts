// deno-lint-ignore-file ban-types
import type { OmitType } from '~/common/types.ts';

/**
 * Maps all properties ommiting functions
 * 
 * @type EntityPropertyType
 */ 
export type EntityPropertyType<E, V> = { [key in keyof OmitType<E, Function>]: V }

export default {}