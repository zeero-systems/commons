import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Regex from '~/validator/validations/Regex.ts';
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

  const validate = (value: any, parameters?: any) => {
    const validation = [{ validation: new Required(), parameters }];
    return Validator.validateValue(value, validation)[0].key;
  };

  it('string', () => {
    expect(validate(testEntity.firstName)).toBe(ValidationEnum.VALID);
  });

  it('null', () => {
    expect(validate(testEntity.lastName)).toBe(ValidationEnum.INVALID);
  });

  it('undefined', () => {
    expect(validate(testEntity.nonProperty)).toBe(ValidationEnum.INVALID);
  });

  it('empty', () => {
    expect(validate(testEntity.address)).toBe(ValidationEnum.INVALID);
  });

});
