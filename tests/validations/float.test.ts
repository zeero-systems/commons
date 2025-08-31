import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Validator from '~/validator/services/Validator.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import Float from '~/validator/validations/Float.ts';

describe('float validation', () => {
  const testEntity = {
    price: '3',
    value: 5,
    amount: '3.34',
    dollar: 7.23,
  };

  const validate = async (value: any, parameters?: any) => {
    const validation = [{ validation: new Float(), parameters: parameters }];
    return (await Validator.validateValue(value, validation))[0].key;
  };

  it('string', async () => {
    expect(await validate(testEntity.price)).toBe(ValidationEnum.INVALID);
    expect(await validate(testEntity.amount)).toBe(ValidationEnum.VALID);
  });
  
  it('number', async () => {
    expect(await validate(testEntity.value)).toBe(ValidationEnum.INVALID);
    expect(await validate(testEntity.dollar)).toBe(ValidationEnum.VALID);
  });

});
