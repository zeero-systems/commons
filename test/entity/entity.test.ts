import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import { UserEntityMock } from '-/test-mock/userEntityMocks.ts';

import constructFn from '~/common/functions/constructFn.ts';

describe('Entity', () => {
  const userEntity = constructFn(UserEntityMock, {
    arguments: {
      firstName: 'eduardo',
      lastName: 'segura',
      email: [{ isMain: true, address: 'eduardo@zxxxro.com' }],
    },
  });

  describe('Implementation', () => {
    it('expect json data', () => {
      expect(userEntity.toEntries()).toEqual([
        ['firstName', 'eduardo'],
        ['lastName', 'segura'],
        ['created', undefined],
        ['birthDate', undefined],
        ['email', [{ 'isMain': true, 'address': 'eduardo@zxxxro.com' }]],
      ]);
    });

    it('expect json data', () => {
      expect(userEntity.toJson()).toEqual({
        firstName: 'eduardo',
        lastName: 'segura',
        created: undefined,
        birthDate: undefined,
        email: [{ 'isMain': true, 'address': 'eduardo@zxxxro.com' }],
      });
    });

    it('expect plain data', () => {
      expect(userEntity.toPlain()).toEqual(
        'firstName=eduardo\nlastName=segura\ncreated=undefined\nbirthDate=undefined\nemail=[object Object]',
      );
    });

    it('get property keys array', () => {
      expect(userEntity.getPropertyKeys()).toEqual(['firstName', 'lastName', 'created', 'birthDate', 'email']);
    });

    it('get property type', () => {
      expect(userEntity.getPropertyType('firstName')).toEqual('string');
      expect(userEntity.getPropertyType('lastName')).toEqual('string');
      expect(userEntity.getPropertyType('birthDate')).toEqual('undefined');
    });
  });
});
