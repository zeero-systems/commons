import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import { UserMock } from '-/test/mocks/commonMocks.ts';
import { UserEntityMock } from '-/test/mocks/entityMocks.ts';
import { SingletonUserMock } from '-/test/mocks/singletonMocks.ts';

import Factory from '~/common/services/Factory.ts';
import Text from '~/common/services/Text.ts';

describe('common', () => {

  describe('construct', () => {
    it('from simple class', () => {
      const userMock = Factory.construct(UserMock, { arguments: { firstName: 'eduardo', lastName: 'segura' } });

      expect(userMock.firstName).toBe('eduardo');
      expect(userMock.lastName).toBe('segura');
    });

    it('from a entity class', () => {
      const userEntityMock = Factory.construct(UserEntityMock, { arguments: { firstName: 'jaime', lastName: 'castro' } });

      expect(userEntityMock.firstName).toBe('jaime');
      expect(userEntityMock.lastName).toBe('castro');
    });
  });

  describe('singleton', () => {
    const userSingletonMockFirst = new SingletonUserMock();
    const userSingletonMockSecond = new SingletonUserMock()
  
    it('has same instance', () => {
      expect(userSingletonMockFirst === userSingletonMockSecond).toBe(true);
    });
  });

  describe('functions', () => {

    describe('Factory.getParameterNames', () => {
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

    describe('toFirstLetterUpercaseFn', () => {
      it('from a callback', () => {
        expect(Text.toFirstLetterUppercase('eduardo')).toEqual('Eduardo');
      });
    });
  });

  
  
});
