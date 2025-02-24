import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Entity from '~/entity/services/Entity.ts';
import Factory from '~/common/services/Factory.ts';
import Required from '~/validator/annotations/Required.ts';

describe('entity', () => {
  class EntityMock extends Entity {
    @Required()
    firstName!: string;
    lastName!: string;
    created!: Date;
    @Required()
    birthDate?: Date;
    email!: Array<{ isMain: boolean; address: string }>;
  }

  const userEntity = Factory.construct(EntityMock, {
    arguments: {
      firstName: 'eduardo',
      lastName: 'segura',
      email: [{ isMain: true, address: 'test@email.com' }],
    },
  });

  it('toEntries method', () => {
    expect(userEntity.toEntries()).toEqual([
      ['firstName', 'eduardo'],
      ['lastName', 'segura'],
      ['created', undefined],
      ['birthDate', undefined],
      ['email', [{ 'isMain': true, 'address': 'test@email.com' }]],
    ]);
  });

  it('toJson method', () => {
    expect(userEntity.toJson()).toEqual({
      firstName: 'eduardo',
      lastName: 'segura',
      created: undefined,
      birthDate: undefined,
      email: [{ 'isMain': true, 'address': 'test@email.com' }],
    });
  });

  it('toPlain method', () => {
    expect(userEntity.toPlain()).toEqual(
      'firstName=eduardo\nlastName=segura\ncreated=undefined\nbirthDate=undefined\nemail=[object Object]',
    );
  });

  it('getPropertyKeys method', () => {
    expect(userEntity.getPropertyKeys()).toEqual(['firstName', 'lastName', 'created', 'birthDate', 'email']);
  });

  it('getPropertyType method', () => {
    expect(userEntity.getPropertyType('firstName')).toEqual('string');
    expect(userEntity.getPropertyType('lastName')).toEqual('string');
    expect(userEntity.getPropertyType('birthDate')).toEqual('undefined');
  });

  it('validateProperties method', () => {
    expect(userEntity.validateProperties()).toMatchObject({
        firstName: [{ key: 'VALID', name: 'Required' }],
        lastName: [{ key: 'UNDEFINED' }],
        created: [{ key: 'UNDEFINED' }],
        birthDate: [{ key: 'INVALID', name: 'Required' }],
        email: [{ key: 'UNDEFINED' }],
    })
  });
});
