// deno-lint-ignore-file ban-types
import type { ValidationInterface } from '~/validator/interfaces.ts';
import type { ValidationResultType } from '~/validator/types.ts';
import type { EntryType, MappedType, OmitType } from '~/common/types.ts';

import ValidationEnum from '~/validator/enums/ValidationEnum.ts';
import Objector from '~/common/services/Objector.ts';

export class Validator {
  public static readonly validation: unique symbol = Symbol('validation');

  public static validateObject<T extends {}>(
    target: T,
    validators: {
      [key: string | symbol]: Array<{ validation: ValidationInterface; parameters?: unknown[] }>;
    },
  ) {
    return Objector.getEntries(target).reduce((previous, [key, value]: EntryType<T>) => {
      return { ...previous, [key]: [...Validator.validateValue(value, validators[key])] };
    }, {} as MappedType<OmitType<T, Function>, Array<ValidationResultType>>);
  }

  public static validateValue<T>(
    value: T,
    validations?: { validation: ValidationInterface; parameters?: unknown[] }[],
  ) {
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
