import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import constructFn from '~/common/functions/constructFn.ts';
import { RequiredEntityMock, UserEntityMock } from '-/test/mocks/entityMocks.ts';

describe('entity', () => {
  describe('extended class', () => {

    const userEntity = constructFn(UserEntityMock, {
      arguments: {
        firstName: 'eduardo',
        lastName: 'segura',
        email: [{ isMain: true, address: 'eduardo@zxxxro.com' }],
      },
    });

    it('entries data', () => {
      expect(userEntity.toEntries()).toEqual([
        ['firstName', 'eduardo'],
        ['lastName', 'segura'],
        ['created', undefined],
        ['birthDate', undefined],
        ['email', [{ 'isMain': true, 'address': 'eduardo@zxxxro.com' }]],
      ]);
    });

    it('json data', () => {
      expect(userEntity.toJson()).toEqual({
        firstName: 'eduardo',
        lastName: 'segura',
        created: undefined,
        birthDate: undefined,
        email: [{ 'isMain': true, 'address': 'eduardo@zxxxro.com' }],
      });
    });

    it('plain data', () => {
      expect(userEntity.toPlain()).toEqual(
        'firstName=eduardo\nlastName=segura\ncreated=undefined\nbirthDate=undefined\nemail=[object Object]',
      );
    });

    it('property keys array', () => {
      expect(userEntity.getPropertyKeys()).toEqual(['firstName', 'lastName', 'created', 'birthDate', 'email']);
    });

    it('property type', () => {
      expect(userEntity.getPropertyType('firstName')).toEqual('string');
      expect(userEntity.getPropertyType('lastName')).toEqual('string');
      expect(userEntity.getPropertyType('birthDate')).toEqual('undefined');
    });

    const requiredEntityMock = new RequiredEntityMock()

    it('properties validation', () => {
      expect(requiredEntityMock.validateProperties()).toEqual({
        birthDate: [{ key: 'INVALID', name: 'Required' }]
      });
    });
  });
});
