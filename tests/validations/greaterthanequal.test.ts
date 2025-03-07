import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Validator from '~/validator/services/Validator.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import GreaterThanEqual from '~/validator/validations/GreaterThanEqual.ts';

describe('greater than equal validation', () => {
  const testEntity = {
    firstName: 'Eduardo',
    lastName: 'Segura',
    employesNumber: 3,
    openingDate: new Date(),
    nonProperty: undefined,
  };

  const validate = (value: any, parameters: any) => {
    const validation = [{ validation: new GreaterThanEqual(), parameters }];
    return Validator.validateValue(value, validation)[0].key;
  };

  it('string', () => {
    expect(validate(testEntity.firstName, 5)).toBe(ValidationEnum.VALID);
    expect(validate(testEntity.lastName, 10)).toBe(ValidationEnum.INVALID);
    expect(validate(testEntity.lastName, 6)).toBe(ValidationEnum.VALID);
  });

  it('date', () => {
    expect(validate(testEntity.openingDate, new Date())).toBe(ValidationEnum.INVALID);
    expect(validate(testEntity.openingDate, testEntity.openingDate)).toBe(ValidationEnum.VALID);
  });

  it('array', () => {
    expect(validate([testEntity], 0)).toBe(ValidationEnum.VALID);
    expect(validate([testEntity], 1)).toBe(ValidationEnum.VALID);
    expect(validate([testEntity], 2)).toBe(ValidationEnum.INVALID);
  });

  it('number', () => {
    expect(validate(testEntity.employesNumber, 10)).toBe(ValidationEnum.INVALID);
    expect(validate(testEntity.employesNumber, 3)).toBe(ValidationEnum.VALID);
  });

  it('unguarded', () => {
    expect(validate(testEntity.nonProperty, 10)).toBe(ValidationEnum.VALID);
  });
});
