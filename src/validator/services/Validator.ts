// deno-lint-ignore-file ban-types
import type { ValidationInterface } from '~/validator/interfaces.ts';
import type { ValidationResultType } from '~/validator/types.ts';
import type { MappedType, OmitType } from '~/common/types.ts';

import ValidationEnum from '~/validator/enums/ValidationEnum.ts';
import Objector from '~/common/services/Objector.ts';

export class Validator {
  public static readonly validation: unique symbol = Symbol('validation');

  public static validateObject<T extends {}>(
    target: T,
    validators: {
      [key: string | symbol]: Array<{ validation: ValidationInterface; parameters?: unknown }>;
    },
  ): Promise<MappedType<OmitType<T, Function>, Array<ValidationResultType>>> {
    
    return new Promise((resolve) => {

      const promises: any = []
      
      for (const [key, _value] of Objector.getEntries(target)) {
        promises.push({ key, result: Validator.validateValue(key as any, validators[key])})        
      }

      Promise.all(promises).then((items) => {
        const validations: any = {}
        for (const { key, result } of items) {
          validations[key] = result
        }
        resolve(validations)
      })
    })

  }

  public static validateValue<T>(
    value: T,
    validations?: { validation: ValidationInterface; parameters?: unknown }[],
  ): ValidationResultType[] {
    const validationResults: Array<ValidationResultType> = [];

    if (!validations || validations.length == 0) {
      return [{ key: ValidationEnum.UNDEFINED }] as ValidationResultType[];
    }

    for (let index = 0; index < validations.length; index++) {
      const validation = validations[index];

      const validationResult: ValidationResultType = {
        key: ValidationEnum.ERROR,
        name: validation.validation.constructor.name,
      };

      if (validation.parameters) {
        validationResult.parameters = validation.parameters;
      }

      try {
        if (
          validation.validation.guards &&
          !validation.validation.guards.some((guard) => guard(value))
        ) {
          validationResult.key = ValidationEnum.UNGUARDED;
        } else {
          validationResult.key = validation.validation.onValidation(value, validation.parameters);
        }
      } catch (_error) {
        validationResult.key = ValidationEnum.ERROR;
      }

      validationResults.push(validationResult);
    }

    return validationResults;
  }
}

export default Validator;
