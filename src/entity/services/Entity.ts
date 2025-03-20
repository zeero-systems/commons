// deno-lint-ignore-file ban-types
import type { EntryType, OmitType } from '~/common/types.ts';
import type { ValidationResultType } from '~/validator/types.ts';
import type { MappedEntityPropertyType } from '~/entity/types.ts';
import type { EntityInterface } from '~/entity/interfaces.ts';

import Objector from '~/common/services/Objector.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

export class Entity implements EntityInterface {
  public toEntries(): ReadonlyArray<EntryType<OmitType<this, Function>>> {
    return Objector.toEntries(this);
  }

  public toPlain(): string {
    return Objector.toPlain(this);
  }

  public toJson(): OmitType<this, Function> {
    return Objector.toJson(this)
  }

  public getPropertyKeys<K extends keyof OmitType<this, Function>>(): K[] {
    return Objector.getPropertyKeys(this)
  }

  public getPropertyType<K extends keyof OmitType<this, Function>>(propertyKey: K): string {
    return Objector.getPropertyType(this, propertyKey)
  }

  public validateProperty<K extends keyof OmitType<this, Function>>(propertyKey: K): ValidationResultType[] {
    return Objector.validateProperty(this, propertyKey)
  }

  public validateProperties(onlyResultWithKeys?: Array<ValidationEnum>): Promise<MappedEntityPropertyType<this, ValidationResultType[]> | undefined> {
    return Objector.validateProperties(this, onlyResultWithKeys)
  }
}

export default Entity
