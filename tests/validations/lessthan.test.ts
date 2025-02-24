import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Validator from '~/validator/services/Validator.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import LessThan from '~/validator/validations/LessThan.ts';

describe('less than validation', () => {
  const testEntity = {
    firstName: 'Eduardo',
    lastName: 'Segura',
    employesNumber: 3,
    openingDate: new Date(),
    nonProperty: undefined,
  };

  const validate = (value: any, parameters: any) => {
    const validation = [{ validation: new LessThan(), parameters }];
    return Validator.validateValue(value, validation)[0].key;
  };

  it('string', () => {
    expect(validate(testEntity.firstName, 5)).toBe(ValidationEnum.INVALID);
    expect(validate(testEntity.lastName, 10)).toBe(ValidationEnum.VALID);
  });

  it('date', () => {
    expect(validate(testEntity.openingDate, new Date())).toBe(ValidationEnum.VALID);
  });

  it('array', () => {
    expect(validate([testEntity], 0)).toBe(ValidationEnum.INVALID);
    expect(validate([testEntity], 1)).toBe(ValidationEnum.INVALID);
    expect(validate([testEntity], 2)).toBe(ValidationEnum.VALID);
  });

  it('number', () => {
    expect(validate(testEntity.employesNumber, 10)).toBe(ValidationEnum.VALID);
  });

  it('unguarded', () => {
    expect(validate(testEntity.nonProperty, 10)).toBe(ValidationEnum.VALID);
  });
});
