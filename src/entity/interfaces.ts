// deno-lint-ignore-file ban-types
import type { EntryType, MappedKeyType, OmitType } from '~/common/types.ts';

export interface EntityInterface {
  toJson(): MappedKeyType<OmitType<this, Function>>;
  toPlain(): string;
  toEntries(): ReadonlyArray<EntryType<OmitType<this, Function>>>;

  getPropertyKeys<K extends keyof OmitType<this, Function>>(): K[];
  getPropertyType<K extends keyof OmitType<this, Function>>(propertyKey: K): string;
}
