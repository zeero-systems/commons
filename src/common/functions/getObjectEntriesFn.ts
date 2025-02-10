// deno-lint-ignore-file ban-types
import { EntryType } from '~/common/types.ts';

export const getObjectEntriesFn = <T extends {}>(object: T): ReadonlyArray<EntryType<T>> => {
  return Object.entries(object) as unknown as ReadonlyArray<EntryType<T>>
}

export default getObjectEntriesFn