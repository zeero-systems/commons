// deno-lint-ignore-file ban-types
import { OmitType } from '~/common/types.ts';
import { ValidationResultType } from '~/validator/types.ts';

export type MappedEntityPropertyType<E, V> = { [key in keyof OmitType<E, Function>]: V }

export const MappedEntityProperty: MappedEntityPropertyType<any, ValidationResultType[]> = { }

export default {}