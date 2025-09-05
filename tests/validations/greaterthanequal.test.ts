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

  const validate = async (value: any, ...parameters: any[]) => {
    const validation = [{ validation: new GreaterThanEqual(), parameters }];
    return (await Validator.validateValue(value, validation))[0].key;
  };

  it('string', async () => {
    expect(await validate(testEntity.firstName, 5)).toBe(ValidationEnum.VALID);
    expect(await validate(testEntity.lastName, 10)).toBe(ValidationEnum.INVALID);
    expect(await validate(testEntity.lastName, 6)).toBe(ValidationEnum.VALID);
  });

  it('date', async () => {
    expect(await validate(testEntity.openingDate, new Date())).toBe(ValidationEnum.INVALID);
    expect(await validate(testEntity.openingDate, testEntity.openingDate)).toBe(ValidationEnum.VALID);
  });

  it('array', async () => {
    expect(await validate([testEntity], 0)).toBe(ValidationEnum.VALID);
    expect(await validate([testEntity], 1)).toBe(ValidationEnum.VALID);
    expect(await validate([testEntity], 2)).toBe(ValidationEnum.INVALID);
  });

  it('number', async () => {
    expect(await validate(testEntity.employesNumber, 10)).toBe(ValidationEnum.INVALID);
    expect(await validate(testEntity.employesNumber, 3)).toBe(ValidationEnum.VALID);
  });

  it('unguarded', async () => {
    expect(await validate(testEntity.nonProperty, 10)).toBe(ValidationEnum.VALID);
  });
});
