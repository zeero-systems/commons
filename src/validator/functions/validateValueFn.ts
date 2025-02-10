import type { ValidationResultType } from '~/validator/types.ts';
import type { ValidationInterface } from '~/validator/interfaces.ts';

import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

export const validateValueFn = <T>(value: T, validations?: { validation: ValidationInterface; parameters?: unknown[] }[]) => {
  const validationResults: Array<ValidationResultType> = [];

  if (!validations?.length) {
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
};

export default validateValueFn;
