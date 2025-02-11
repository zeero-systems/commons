import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import constructFn from '~/common/functions/constructFn.ts';
import { ConsumerUserMock } from '-/test-mock/userMocks.ts';

describe('Provider', () => {
  
  const userEntity = constructFn(ConsumerUserMock);

  describe('injeted from a accessor field', () => {        
    it('service was injected', () => {
      expect(userEntity.userService).toBeDefined()
    });

    it('field has correct value', () => {
      expect(userEntity.getAccessorUserFirstName()).toEqual("Eduardo")
    });
  });

  describe('injeted from a constructor class', () => {
    it('service was injected', () => {
      expect(userEntity.userService).toBeDefined()
    });

    it('field has correct value', () => {
      expect(userEntity.getConstructorUserFirstName()).toEqual("Eduardo")
    });
  });
});
