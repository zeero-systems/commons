// deno-lint-ignore-file ban-types
import type { OmitType } from '~/common/types.ts';

/**
 * Maps all properties ommiting functions
 * 
 * @type MappedEntityPropertyType
 */ 
export type MappedEntityPropertyType<E, V> = { [key in keyof OmitType<E, Function>]: V }

export default {}