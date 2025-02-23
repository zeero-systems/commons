import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Validator from '~/validator/services/Validator.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import { Required } from '-/test/mocks/validatorMocks.ts';
import { RequiredEntityMock } from '-/test/mocks/entityMocks.ts';

describe('validator', () => {
  it('expect invalid property', () => {
    const userEntity = new RequiredEntityMock();

    const validations = [{ validation: new Required() }];

    const result = Validator.validateValue(userEntity.firstName, validations);

    expect(result[0].key).toBe(ValidationEnum.INVALID);
  });

  it('expect unguarded property', () => {
    const userEntity = new RequiredEntityMock();

    userEntity.firstName = 'Eduardo';
    userEntity.birthDate = new Date();

    const validations = {
      firstName: [{ validation: new Required() }],
      birthDate: [{ validation: new Required() }],
    };

    const result = Validator.validateObject(userEntity, validations);

    expect(result).toEqual({
      firstName: [{ key: ValidationEnum.VALID, name: 'Required' }],
      birthDate: [{ key: ValidationEnum.VALID, name: 'Required' }],
      lastName: [{ key: ValidationEnum.UNDEFINED }],
    });
  });
});
