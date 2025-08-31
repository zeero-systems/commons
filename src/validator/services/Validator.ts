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
        promises.push(new Promise((resolve) => {
          Validator.validateValue(key as any, validators[key]).then((result) => {
            resolve({ key, result })
          })
        }))        
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
  ): Promise<ValidationResultType[]> {
    if (!validations || validations.length == 0) {
      return Promise.resolve([{ key: ValidationEnum.UNDEFINED }] as ValidationResultType[]);
    }

    const validationResults: Array<Promise<ValidationResultType>> = [];

    for (let index = 0; index < validations.length; index++) {
      validationResults.push(new Promise((resolve) => {
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
            validation.validation.accepts &&
            !validation.validation.accepts.some((accept) => accept(value))
          ) {
            resolve({ ...validationResult, key: ValidationEnum.UNGUARDED})
          } else {
            validation.validation.onValidation(value, validation.parameters)
              .then((key) => {
                resolve({ ...validationResult, key })
              })
          }
        } catch (_error) {
          resolve({ ...validationResult, key: ValidationEnum.ERROR})
        }        
      }))
    }

    return Promise.all(validationResults);
  }
}

export default Validator;
