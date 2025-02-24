
import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Container from '~/container/services/Container.ts';
import Factory from '~/common/services/Factory.ts';
import Metadata from '~/common/services/Metadata.ts';
import Module from '~/container/annotations/Module.ts';

import isDecoratorMetadataFn from '~/decorator/guards/isDecoratorMetadataFn.ts';

describe('module', () => {

  class NonProviderMock {
    public getName() {
      return 'NonProvider'
    }
  }
  
  class NonConsumerMock {
    constructor(public nonProviderMock: NonProviderMock) {}
  }
  
  @Module()
  class EmptyApp {}
  
  @Module({
    providers: [NonProviderMock]
  })
  class ProviderApp {}
  
  @Module({
    providers: [NonProviderMock]
  })
  class ConsumerApp {
    constructor(public nonProviderMock: NonProviderMock) {}
  }
  
  @Module({
    providers: [NonProviderMock],
    consumers: [NonConsumerMock],
  })
  class ProviderConsumerApp {
    constructor(
      public nonProviderMock: NonProviderMock,
      public nonConsumerMock: NonConsumerMock
    ) {}
  }
  
  @Module({
    providers: [ProviderConsumerApp]
  })
  class AnotherProviderConsumerApp {
    constructor(public providerConsumerApp: ProviderConsumerApp) {}
  }


  it('check annotation', () => {
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

  it('inject providers', () => {
    const consumerApp = Factory.construct(ConsumerApp)
    expect(consumerApp.nonProviderMock.getName()).not.toBeUndefined()
  })

  it('inject consumer and providers', () => {
    const providerConsumerApp = Factory.construct(ProviderConsumerApp)
    
    expect(providerConsumerApp.nonProviderMock.getName()).not.toBeUndefined()
    expect(providerConsumerApp.nonConsumerMock.nonProviderMock.getName()).not.toBeUndefined()
  })

  it('inject another module', () => {
    const anotherProviderConsumerApp = Factory.construct(AnotherProviderConsumerApp)
    
    expect(anotherProviderConsumerApp.providerConsumerApp.nonProviderMock.getName()).not.toBeUndefined()
    expect(anotherProviderConsumerApp.providerConsumerApp.nonConsumerMock.nonProviderMock.getName()).not.toBeUndefined()
  })

});
