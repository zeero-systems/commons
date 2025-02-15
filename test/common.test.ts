import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import constructFn from '~/common/functions/constructFn.ts';
import getParameterNamesFn from '~/common/functions/getParameterNamesFn.ts';
import toFirstLetterToUppercaseFn from '~/common/functions/toFirstLetterUppercaseFn.ts';
import { UserMock } from '-/test/mocks/commonMocks.ts';
import { UserEntityMock } from '-/test/mocks/entityMocks.ts';
import { SingletonUserMock } from '-/test/mocks/singletonMocks.ts';

describe('common', () => {

  describe('construct', () => {
    it('from simple class', () => {
      const userMock = constructFn(UserMock, { arguments: { firstName: 'eduardo', lastName: 'segura' } });

      expect(userMock.firstName).toBe('eduardo');
      expect(userMock.lastName).toBe('segura');
    });

    it('from a entity class', () => {
      const userEntityMock = constructFn(UserEntityMock, { arguments: { firstName: 'jaime', lastName: 'castro' } });

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

    describe('getParameterNamesFn', () => {
      it('with normal parameters', () => {
        function normalFunctionName(_text: string) {}
    
        expect(getParameterNamesFn(normalFunctionName)).toEqual(['_text']);
      });
    
      it('with this parameters', () => {
        function functionWithThis(this: string) {}
    
        expect(getParameterNamesFn(functionWithThis)).toEqual([]);
      });
    
      it('with an arrow function', () => {
        const arrowFunctionWithoutName = (_id: number) => {};
    
        expect(getParameterNamesFn(arrowFunctionWithoutName)).toEqual(['_id']);
      });
    });

    describe('toFirstLetterUpercaseFn', () => {
      it('from a callback', () => {
        expect(toFirstLetterToUppercaseFn('eduardo')).toEqual('Eduardo');
      });
    });
  });

  
  
});
