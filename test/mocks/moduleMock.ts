
import Module from '~/module/decorations/Module.ts';
import Singleton from '~/common/decorations/Singleton.ts';
import Consumer from '~/provider/decorations/Consumer.ts';

export class NonProviderMock {
  public getName() {
    return 'NonProvider'
  }
}

export class NonConsumerMock {
  constructor(public nonProviderMock: NonProviderMock) {}
}

@Singleton()
@Module()
export class EmptyApp {}

@Singleton()
@Module({
  providers: [NonProviderMock]
})
export class ProviderApp {}

@Module({
  providers: [NonProviderMock]
})
export class ConsumerApp {
  constructor(public nonProviderMock: NonProviderMock) {}
}

@Module({
  providers: [NonProviderMock],
  consumers: [NonConsumerMock],
})
export class ProviderConsumerApp {
  constructor(
    public nonProviderMock: NonProviderMock,
    public nonConsumerMock: NonConsumerMock
  ) {}
}

@Module({
  providers: [ProviderConsumerApp]
})
export class AnotherProviderConsumerApp {
  constructor(public providerConsumerApp: ProviderConsumerApp) {}
}
