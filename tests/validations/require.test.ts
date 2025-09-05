import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Validator from '~/validator/services/Validator.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';
import Required from '~/validator/validations/Required.ts';

describe('require validation', () => {
  const testEntity = {
    firstName: 'Eduardo',
    lastName: null,
    nonProperty: undefined,
    address: '',
  };

  const validate = async (value: any, ...parameters: any[]) => {
    const validation = [{ validation: new Required(), parameters }];
    return (await Validator.validateValue(value, validation))[0].key;
  };

  it('string', async () => {
    expect(await validate(testEntity.firstName)).toBe(ValidationEnum.VALID);
  });

  it('null', async () => {
    expect(await validate(testEntity.lastName)).toBe(ValidationEnum.INVALID);
  });

  it('undefined', async () => {
    expect(await validate(testEntity.nonProperty)).toBe(ValidationEnum.INVALID);
  });

  it('empty', async () => {
    expect(await validate(testEntity.address)).toBe(ValidationEnum.INVALID);
  });

});
