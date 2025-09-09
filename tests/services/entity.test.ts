import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Entity from '~/entity/services/entity.service.ts';
import Factory from '~/common/services/factory.service.ts';
import Required from '~/validator/validations/required.validation.ts';
import ValidationEnum from '~/validator/enums/validation.enum.ts';
import Use from '~/decorator/services/decorator-use.service.ts';

describe('entity', () => {
  class EntityExtended extends Entity {
    @Use(Required)
    firstName!: string;
    lastName!: string;
    created?: Date;
    @Use(Required)
    birthDate?: Date;
    email!: Array<{ isMain: boolean; address: string }>;
  }

  const entityExtended = Factory.construct(EntityExtended, {
    arguments: {
      firstName: 'eduardo',
      lastName: 'segura',
      email: [{ isMain: true, address: 'test@email.com' }],
    },
  });

  it('toEntries method', () => {
    expect(entityExtended.toEntries()).toEqual([
      ['firstName', 'eduardo'],
      ['lastName', 'segura'],
      ['created', undefined],
      ['birthDate', undefined],
      ['email', [{ 'isMain': true, 'address': 'test@email.com' }]],
    ]);
  });

  it('toJson method', () => {
    expect(entityExtended.toJson()).toEqual({
      firstName: 'eduardo',
      lastName: 'segura',
      created: undefined,
      birthDate: undefined,
      email: [{ 'isMain': true, 'address': 'test@email.com' }],
    });
  });

  it('toPlain method', () => {
    expect(entityExtended.toPlain()).toEqual(
      'firstName=eduardo\nlastName=segura\ncreated=undefined\nbirthDate=undefined\nemail=[object Object]',
    );
  });

  it('getPropertyKeys method', () => {
    expect(entityExtended.getPropertyKeys()).toEqual(['firstName', 'lastName', 'created', 'birthDate', 'email']);
  });

  it('getPropertyType method', () => {
    expect(entityExtended.getPropertyType('firstName')).toEqual('string');
    expect(entityExtended.getPropertyType('lastName')).toEqual('string');
    expect(entityExtended.getPropertyType('birthDate')).toEqual('undefined');
  });

  it('validateProperties method', async () => {
    expect(await entityExtended.validateProperties()).toMatchObject({
      firstName: [{ key: 'VALID', name: 'Required' }],
      lastName: [{ key: 'UNDEFINED' }],
      created: [{ key: 'UNDEFINED' }],
      birthDate: [{ key: 'INVALID', name: 'Required' }],
      email: [{ key: 'UNDEFINED' }],
    });
  });

  it('validateProperties onlyWithInvalidResults method', async () => {
    expect(await entityExtended.validateProperties([ValidationEnum.INVALID])).toMatchObject({
      birthDate: [{ key: 'INVALID', name: 'Required' }],
    });
  });
});
