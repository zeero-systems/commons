import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Entity from '~/entity/services/Entity.ts';
import Factory from '~/common/services/Factory.ts';

describe('factory', () => {
  class UserMock {
    firstName!: string;
    lastName!: string;
    created!: Date;
    email!: Array<{ isMain: boolean; address: string }>;
  }

  class UserEntityMock extends Entity {
    firstName!: string;
    lastName!: string;
  }

  describe('construct method', () => {
    it('with a simple class', () => {
      const userMock = Factory.construct(UserMock, { arguments: { firstName: 'eduardo', lastName: 'segura' } });

      expect(userMock.firstName).toBe('eduardo');
      expect(userMock.lastName).toBe('segura');
    });

    it('with a entity class', () => {
      const userEntityMock = Factory.construct(UserEntityMock, {
        arguments: { firstName: 'jaime', lastName: 'castro' },
      });

      expect(userEntityMock.firstName).toBe('jaime');
      expect(userEntityMock.lastName).toBe('castro');
    });
  });

  describe('getParameterNames method', () => {
    it('with normal parameters', () => {
      function normalFunctionName(_text: string) {}

      expect(Factory.getParameterNames(normalFunctionName)).toEqual(['_text']);
    });

    it('with this parameters', () => {
      function functionWithThis(this: string) {}

      expect(Factory.getParameterNames(functionWithThis)).toEqual([]);
    });

    it('with an arrow function', () => {
      const arrowFunctionWithoutName = (_id: number) => {};

      expect(Factory.getParameterNames(arrowFunctionWithoutName)).toEqual(['_id']);
    });
  });
});
