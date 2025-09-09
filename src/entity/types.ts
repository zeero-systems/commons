import type { FunctionType, OmitType } from '~/common/types.ts';

/**
 * Maps all properties ommiting functions
 * 
 * @type EntityPropertyType
 */ 
export type EntityPropertyType<E, V> = { [key in keyof OmitType<E, FunctionType>]: V }

export default {}