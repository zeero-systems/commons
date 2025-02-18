import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import validateValueFn from '~/validator/functions/validateValueFn.ts';
import validateObjectFn from '~/validator/functions/validateObjectFn.ts';

import { Required } from '-/test/mocks/validatorMocks.ts';
import { UserEntityMock } from '-/test/mocks/entityMocks.ts';

describe('validator', () => {
  it('expect invalid property', () => {
    const userEntity = new UserEntityMock();

    const validations = [{ validation: new Required() }];

    const result = validateValueFn(userEntity.firstName, validations);

    expect(result[0].key).toBe(ValidationEnum.INVALID);
  });

  it('expect unguarded property', () => {
    const userEntity = new UserEntityMock();

    userEntity.firstName = 'Eduardo';

    const validations = {
      firstName: [{ validation: new Required() }],
    };

    const result = validateObjectFn(userEntity, validations);

    expect(result).toEqual({
      birthDate: [{ key: ValidationEnum.UNDEFINED }],
      created: [{ key: ValidationEnum.UNDEFINED }],
      email: [{ key: ValidationEnum.UNDEFINED }],
      firstName: [{ key: ValidationEnum.UNGUARDED, name: 'Required' }],
      lastName: [{ key: ValidationEnum.UNDEFINED }],
    });
  });
});
