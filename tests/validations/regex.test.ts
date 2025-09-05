import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Regex from '~/validator/validations/Regex.ts';
import Validator from '~/validator/services/Validator.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

describe('regex validation', () => {
  const testEntity = {
    firstName: 'Eduardo',
  };

  const validate = async (value: any, ...parameters: any[]) => {
    const validation = [{ validation: new Regex(), parameters }];
    return (await Validator.validateValue(value, validation))[0].key;
  };

  it('string', async () => {
    expect(await validate(testEntity.firstName, 'Eduardo')).toBe(ValidationEnum.VALID);
  });

  it('reg exp', async () => {
    expect(await validate(testEntity.firstName, /ard/)).toBe(ValidationEnum.VALID);
  });
});
