import type { FunctionType, MappedPropertiesType, OmitType } from '~/common/types.ts';
import type { ValidationResultType } from '~/validator/types.ts';
import type { EntityInterface } from '~/entity/interfaces.ts';
import type { ValidationInterface } from '~/validator/interfaces.ts';
import type { AnnotationInterface } from '~/decorator/interfaces.ts';

import Objector from '~/common/services/objector.service.ts';
import ValidationEnum from '~/validator/enums/validation.enum.ts';
import Validator from '~/validator/services/validator.service.ts';
import DecoratorMetadata from '~/decorator/services/decorator-metadata.service.ts';
import isValidation from '~/validator/guards/is-validation.guard.ts';
import isEntity from '~/entity/guards/is-entity.guard.ts';

export class Entity implements EntityInterface {
  public toEntries(): readonly [string, unknown][] {
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

  public async validateProperty<K extends keyof OmitType<this, FunctionType>>(propertyKey: K): Promise<Array<ValidationResultType> | any> {
    const decorations = DecoratorMetadata.filterByTargetPropertyKeys(this, [propertyKey])

    const validations = decorations.reduce((previous: (ValidationInterface & AnnotationInterface)[], current) => {
      if (isValidation(current.annotation.target)) {
        previous.push(current.annotation.target);
      }
      return previous;
    }, [])

    const value = this[propertyKey];

    if (isEntity(value)) {
      return await value.validateProperties();
    }

    if (Array.isArray(value)) {
      const arrayValidations = await Promise.all(
        value.map(async (item) => {
          if (isEntity(item)) {
            return await item.validateProperties();
          }
          return undefined;
        })
      );
      
      const filteredValidations = arrayValidations.filter(v => v !== undefined);
      if (filteredValidations.length > 0) {
        return arrayValidations;
      }
    }

    return await Validator.validateValue(value, validations);
  }

  public validateProperties(onlyResultWithKeys?: Array<ValidationEnum>): Promise<MappedPropertiesType<this, ValidationResultType[] | any> | undefined> {
    const promises = [];

    for (const key of this.getPropertyKeys()) {
      promises.push(
        this.validateProperty(key)
          .then((validations: any) => {
            if (validations && typeof validations === 'object' && !Array.isArray(validations)) {
              return { key, validations };
            }
            
            if (Array.isArray(validations) && validations.some((v: any) => v && typeof v === 'object' && !v.key)) {
              return { key, validations };
            }
            
            if (onlyResultWithKeys && Array.isArray(validations)) {
              validations = validations.filter((v: ValidationResultType) => onlyResultWithKeys!.includes(v.key));
            }

            return { key, validations };
          }),
      );
    }

    return Promise.all(promises).then((results) => {
      let targetValidations: { [key: string | symbol]: ValidationResultType[] | any } | undefined;
      for (const { key, validations } of results) {
        if (validations && (
          (Array.isArray(validations) && validations.length > 0) ||
          (!Array.isArray(validations) && typeof validations === 'object')
        )) {
          if (!targetValidations) targetValidations = {};
          targetValidations[key] = validations;
        }
      }
      return targetValidations as MappedPropertiesType<this, ValidationResultType[] | any> | undefined;
    });
  }
}

export default Entity