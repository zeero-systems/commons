import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import constructFn from '~/common/functions/constructFn.ts';
import { ConsumerUserMock } from '-/test-mock/userMocks.ts';
import Provider from '~/provider/services/Provider.ts';
import { ProviderType } from '~/provider/types.ts';

describe('Provider', () => {
  
  const userEntity = constructFn(ConsumerUserMock);

  console.log(userEntity)

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
