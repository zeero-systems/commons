
import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import { AnotherProviderConsumerApp, ConsumerApp, EmptyApp, ProviderApp, ProviderConsumerApp } from '-/test/mocks/moduleMock.ts';

import Container from '~/container/services/Container.ts';

import Metadata from '~/common/services/Metadata.ts';
import isDecoratorMetadataFn from '~/decorator/guards/isDecoratorMetadataFn.ts';
import Factory from '~/common/services/Factory.ts';

describe('module', () => {
  it('add empty module', () => {
    const appModule = new EmptyApp()
    const metadata = Metadata.get(appModule);
    
    expect(() => {
      if (isDecoratorMetadataFn(metadata)) {
        return metadata.get('contructor')?.find(decoration => {
          // @ts-ignore name property
          return decoration.annotation.name == 'Module'
        })
      }
      return false
    })
  });

  it('apply providers', () => {
    new ProviderApp()
    expect(Container.providers.get("NonProviderMock")).not.toBeUndefined()
  })

  it('instantiate providers', () => {
    const consumerApp = Factory.construct(ConsumerApp)
    expect(consumerApp.nonProviderMock.getName()).not.toBeUndefined()
  })

  it('instantiate consumer and providers', () => {
    const providerConsumerApp = Factory.construct(ProviderConsumerApp)
    
    expect(providerConsumerApp.nonProviderMock.getName()).not.toBeUndefined()
    expect(providerConsumerApp.nonConsumerMock.nonProviderMock.getName()).not.toBeUndefined()
  })

  it('instantiate another module', () => {
    const anotherProviderConsumerApp = Factory.construct(AnotherProviderConsumerApp)
    
    expect(anotherProviderConsumerApp.providerConsumerApp.nonProviderMock.getName()).not.toBeUndefined()
    expect(anotherProviderConsumerApp.providerConsumerApp.nonConsumerMock.nonProviderMock.getName()).not.toBeUndefined()
  })

});
