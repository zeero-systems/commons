import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Entity from '~/entity/services/entity.service.ts';
import Factory from '~/common/services/factory.service.ts';

describe('factory', () => {
  class UserMock {
    public nickName!: string
    public avatarUrl?: string

    constructor(public firstName?: string, public lastName?: string) {}
  }

  class UserEntityMock extends Entity {
    nickName?: string;
    email!: string;
  }

  describe('construct method', () => {
    it('with index parameters', () => {
      const userMock = Factory.construct(UserMock, { arguments: { construct: [ 'eduardo', 'segura' ]  }});

      expect(userMock.firstName).toBe('eduardo');
      expect(userMock.lastName).toBe('segura');
    });

    it('with named parameters', () => {
      const userMock = Factory.construct(UserMock, { arguments: { properties: { nickName: 'eduardo', avatarUrl: 'url.com.br' } } });

      expect(userMock.nickName).toBe('eduardo');
      expect(userMock.avatarUrl).toBe('url.com.br');
    });

    it('with a entity class', () => {
      const userEntityMock = Factory.construct(UserEntityMock, {
        arguments: { properties: { nickName: 'jaime', email: 'test@email.com' } },
      });

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
