import type { EntryType, FunctionType, MappedPropertiesType, OmitType } from '~/common/types.ts';
import type { ValidationResultType } from '~/validator/types.ts';
import type { EntityInterface } from '~/entity/interfaces.ts';
import type { ValidationInterface } from '~/validator/interfaces.ts';
import type { AnnotationInterface } from '~/decorator/interfaces.ts';

import Objector from '~/common/services/objector.service.ts';
import ValidationEnum from '~/validator/enums/validation.enum.ts';
import Validator from '~/validator/services/validator.service.ts';
import DecoratorMetadata from '~/decorator/services/decorator-metadata.service.ts';
import isValidation from '~/validator/guards/is-validation.guard.ts';

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
    const decorations = DecoratorMetadata.filterByTargetPropertyKeys(this, [propertyKey])

    const validations = decorations.reduce((previous: (ValidationInterface & AnnotationInterface)[], current) => {
      if (isValidation(current.annotation.target)) {
        previous.push(current.annotation.target);
      }
      return previous;
    }, [])

    return Validator.validateValue(this[propertyKey], validations);
  }

  public validateProperties(onlyResultWithKeys?: Array<ValidationEnum>): Promise<MappedPropertiesType<this, ValidationResultType[]> | undefined> {
    const promises = [];

    for (const key of this.getPropertyKeys()) {
      promises.push(
        this.validateProperty(key)
          .then((validations) => {
            if (onlyResultWithKeys) {
              validations = validations.filter((v) => onlyResultWithKeys!.includes(v.key));
            }

            return { key, validations };
          }),
      );
    }

    return Promise.all(promises).then((results) => {
      let targetValidations: { [key: string | symbol]: ValidationResultType[] } | undefined;
      for (const { key, validations } of results) {
        if (validations.length > 0) {
          if (!targetValidations) targetValidations = {};
          targetValidations[key] = validations;
        }
      }
      return targetValidations as MappedPropertiesType<this, ValidationResultType[]> | undefined;
    });
  }
}

export default Entity