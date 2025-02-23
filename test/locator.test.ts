import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import { ConsumerAccountMock, ConsumerNotFoundProviderMock } from '-/test/mocks/locatorMocks.ts';

import Factory from '~/common/services/Factory.ts';
import ProviderException from '~/container/exceptions/ProviderException.ts';

describe('locator', () => {
  
  it('throws if provider do not exist and is not optional', () => {
    expect(() => Factory.construct(ConsumerNotFoundProviderMock)).toThrow(ProviderException)
  });

  const consumerAccountMock = Factory.construct(ConsumerAccountMock)

  it('inject on constructor property', () => {
    expect(consumerAccountMock.getUserFirstName()).toEqual('Eduardo')
  });

  it('inject on first field property', () => {
    expect(consumerAccountMock.getFirstAccessorUserFirstName()).toEqual('Eduardo')
    expect(consumerAccountMock.getSecondAccessorUserFirstName()).toEqual('Eduardo')
  });
});
