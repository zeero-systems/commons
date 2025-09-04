import type { EntryType, FunctionType, MappedPropertiesType, OmitType } from '~/common/types.ts';
import type { ValidationResultType } from '~/validator/types.ts';
import type { DecorationMetadataType } from '~/decorator/types.ts';
import type { EntityInterface } from '~/entity/interfaces.ts';

import Objector from '~/common/services/Objector.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';
import Decoration from '~/decorator/services/Decoration.ts';

export class Entity implements EntityInterface {
  public toEntries(): ReadonlyArray<EntryType<OmitType<this, FunctionType>>> {
    return Objector.toEntries(this);
  }

  public toPlain(): string {
    return Objector.toPlain(this);
  }

  public toJson(): OmitType<this, FunctionType> {
    return Objector.toJson(this)
  }

  public getPropertyKeys<K extends keyof OmitType<this, FunctionType>>(): K[] {
    return Objector.getPropertyKeys(this)
  }

  public getPropertyType<K extends keyof OmitType<this, FunctionType>>(propertyKey: K): string {
    return Objector.getPropertyType(this, propertyKey)
  }

  public validateProperty<K extends keyof OmitType<this, FunctionType>>(propertyKey: K): Promise<Array<ValidationResultType>> {
    return Objector.validateProperty(this, propertyKey)
  }

  public validateProperties(onlyResultWithKeys?: Array<ValidationEnum>): Promise<MappedPropertiesType<this, ValidationResultType[]> | undefined> {
    return Objector.validateProperties(this, onlyResultWithKeys)
  }
}

export default Entity
