import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Validator from '~/validator/services/validator.service.ts';
import ValidationEnum from '~/validator/enums/validation.enum.ts';

import GreaterThan from '~/validator/validations/greater-than.validation.ts';

describe('greater than validation', () => {
  const testEntity = {
    firstName: 'Eduardo',
    lastName: 'Segura',
    employesNumber: 3,
    openingDate: new Date(),
    nonProperty: undefined,
  };

  const validate = async (value: any, ...parameters: any[]) => {
    const validation = [new GreaterThan(parameters[0])];
    return (await Validator.validateValue(value, validation))[0].key;
  };

  it('string', async () => {
    expect(await validate(testEntity.firstName, 5)).toBe(ValidationEnum.VALID);
    expect(await validate(testEntity.lastName, 10)).toBe(ValidationEnum.INVALID);
  });

  it('date', async () => {
    expect(await validate(testEntity.openingDate, new Date())).toBe(ValidationEnum.INVALID);
  });

  it('array', async () => {
    expect(await validate([testEntity], 0)).toBe(ValidationEnum.VALID);
    expect(await validate([testEntity], 1)).toBe(ValidationEnum.INVALID);
    expect(await validate([testEntity], 2)).toBe(ValidationEnum.INVALID);
  });

  it('number', async () => {
    expect(await validate(testEntity.employesNumber, 10)).toBe(ValidationEnum.INVALID);
  });

  it('unguarded', async () => {
    expect(await validate(testEntity.nonProperty, 10)).toBe(ValidationEnum.VALID);
  });
});
