import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Regex from '~/validator/validations/Regex.ts';
import Validator from '~/validator/services/Validator.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

describe('regex validation', () => {
  const testEntity = {
    firstName: 'Eduardo',
  };

  const validate = (value: any, parameters: any) => {
    const validation = [{ validation: new Regex(), parameters }];
    return Validator.validateValue(value, validation)[0].key;
  };

  it('string', () => {
    expect(validate(testEntity.firstName, 'Eduardo')).toBe(ValidationEnum.VALID);
  });

  it('reg exp', () => {
    expect(validate(testEntity.firstName, /ard/)).toBe(ValidationEnum.VALID);
  });
});
