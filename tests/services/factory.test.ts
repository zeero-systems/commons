import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Entity from '~/entity/services/entity.service.ts';
import Factory from '~/common/services/factory.service.ts';

describe('factory', () => {
  class UserMock {
    public nickName!: string
    public avatarUrl?: string

    constructor(login: string, public firstName: string, public lastName?: string) {
      login = `_${login}_`
    }
  }

  class UserEntityMock extends Entity {
    nickName?: string;
    email!: string;
  }

  describe('construct method', () => {
    it('with index parameters', () => {
      const userMock = Factory.arguments(UserMock, ['test', 'eduardo', 'segura'])

      expect(userMock.firstName).toBe('eduardo');
      expect(userMock.lastName).toBe('segura');
    });

    it('with named parameters', () => {
      const userMock = Factory.properties(UserMock, { firstName: 'eduardo', nickName: 'zero' });

      expect(userMock.nickName).toBe('zero');
      expect(userMock.avatarUrl).toBe(undefined);
    });

    it('with a entity class', () => {
      const userEntityMock = Factory.properties(UserEntityMock, { nickName: 'jaime', email: 'test@email.com' });

      expect(userEntityMock.nickName).toBe('jaime');
      expect(userEntityMock.email).toBe('test@email.com');
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
