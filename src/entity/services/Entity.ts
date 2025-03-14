// deno-lint-ignore-file ban-types
import type { EntryType, OmitType } from '~/common/types.ts';
import type { ValidationResultType } from '~/validator/types.ts';
import type { MappedEntityPropertyType } from '~/entity/types.ts';
import type { EntityInterface } from '~/entity/interfaces.ts';

import Artifact from '~/entity/services/Artifact.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

export class Entity implements EntityInterface {
  public toEntries(): ReadonlyArray<EntryType<OmitType<this, Function>>> {
    return Artifact.toEntries(this);
  }

  public toPlain(): string {
    return Artifact.toPlain(this);
  }

  public toJson(): OmitType<this, Function> {
    return Artifact.toJson(this)
  }

  public getPropertyKeys<K extends keyof OmitType<this, Function>>(): K[] {
    return Artifact.getPropertyKeys(this)
  }

  public getPropertyType<K extends keyof OmitType<this, Function>>(propertyKey: K): string {
    return Artifact.getPropertyType(this, propertyKey)
  }

  public validateProperty<K extends keyof OmitType<this, Function>>(propertyKey: K): ValidationResultType[] {
    return Artifact.validateProperty(this, propertyKey)
  }

  public validateProperties(onlyResultWithKeys?: Array<ValidationEnum>): Promise<MappedEntityPropertyType<this, ValidationResultType[]> | undefined> {
    return Artifact.validateProperties(this, onlyResultWithKeys)
  }
}

export default Entity
