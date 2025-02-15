
import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import { AnotherProviderConsumerApp, ConsumerApp, EmptyApp, ProviderApp, ProviderConsumerApp } from '-/test/mocks/moduleMock.ts';

import Metadata from '~/decorator/services/Metadata.ts';
import MetadataTagEnum from '~/common/enums/MetadataTagEnum.ts';
import Provider from '~/provider/services/Provider.ts';

import constructFn from '~/common/functions/constructFn.ts';

describe('module', () => {
  it('add empty module', () => {
    const appModule = new EmptyApp()

    expect(Metadata.getTags(appModule)?.includes(MetadataTagEnum.MODULE))
  });

  it('apply providers', () => {
    new ProviderApp()
    expect(Provider.providers.get("NonProviderMock")).not.toBeUndefined()
  })

  it('instantiate providers', () => {
    const consumerApp = constructFn(ConsumerApp)
    expect(consumerApp.nonProviderMock.getName()).not.toBeUndefined()
  })

  it('instantiate consumer and providers', () => {
    const providerConsumerApp = constructFn(ProviderConsumerApp)
    
    expect(providerConsumerApp.nonProviderMock.getName()).not.toBeUndefined()
    expect(providerConsumerApp.nonConsumerMock.nonProviderMock.getName()).not.toBeUndefined()
  })

  it('instantiate another module', () => {
    const anotherProviderConsumerApp = constructFn(AnotherProviderConsumerApp)
    
    expect(anotherProviderConsumerApp.providerConsumerApp.nonProviderMock.getName()).not.toBeUndefined()
    expect(anotherProviderConsumerApp.providerConsumerApp.nonConsumerMock.nonProviderMock.getName()).not.toBeUndefined()

    console.log(Provider.providers)
  })

});
