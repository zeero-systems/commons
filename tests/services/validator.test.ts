import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Validator from '~/validator/services/Validator.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';
import Required from '~/validator/annotations/Required.ts';
import RequiredValidation from '~/validator/validations/Required.ts';
import Factory from '~/common/services/Factory.ts';


describe('validator', () => {
  class UserMock {
    @Required()
    firstName!: string
    lastName?: string
    birthDate?: Date
  }

  const userEntity = Factory.construct(UserMock, {
    arguments: {
      properties: {
        firstName: 'eduardo',
      }
    },
  });


  it('validateValue method', async () => {
    
    const validations = [{ validation: new RequiredValidation() }];

    const result = await Validator.validateValue(userEntity.lastName, validations);

    expect(result[0].key).toBe(ValidationEnum.INVALID);
  });

  it('validateObject method', async () => {
  
    userEntity.firstName = 'Eduardo';
    userEntity.birthDate = new Date();

    const validations = {
      firstName: [{ validation: new RequiredValidation() }],
      birthDate: [{ validation: new RequiredValidation() }],
    };

    const result = await Validator.validateObject(userEntity, validations);

    expect(result).toEqual({
      firstName: [{ key: ValidationEnum.VALID, name: 'Required' }],
      birthDate: [{ key: ValidationEnum.VALID, name: 'Required' }],
      lastName: [{ key: ValidationEnum.UNDEFINED }],
    });
  });
});
