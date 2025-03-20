import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Provider from '~/container/annotations/Provider.ts';
import ScopeEnum from '~/container/enums/ScopeEnum.ts';
import Container from '~/container/services/Container.ts';
import Artifactor from '~/common/services/Artifactor.ts';
import Consumer from '~/container/annotations/Consumer.ts';

describe('container', () => {

  interface UserMockInterface {
    getUserFirstName(): string
  }

  @Provider(ScopeEnum.Transient)
  class UserMock implements UserMockInterface {
    public getUserFirstName(): string {
      return 'Eduardo'
    }
  }

  @Provider(ScopeEnum.Transient)
  class UserRepositoryMock {
    public getUser(): any {
      return { name: 'Eduardo' }
    }
  }

  @Consumer()
  @Provider(ScopeEnum.Transient)
  class UserServiceMock {
    constructor(public userRepositoryMock: UserRepositoryMock) {}
  }

  @Provider(ScopeEnum.Transient)
  class CustomServiceMock {
    constructor(public CUSTOM: any) {}
  }

  const customArtifact = { name: 'Custom', target: { email: 'test@email.com' } }

  Artifactor.set('CUSTOM', customArtifact)

  const containerPerpetual = Container.create('PERPETUAL')
  const containerRequest = Container.create('REQUEST')

  console.log('perpetual', containerPerpetual.artifacts)
  console.log('artifacts', Artifactor.artifacts)

  it('instantiate from container', () => {
    const user = containerPerpetual.construct('UserMock')
    expect(user).not.toBeUndefined()
  });

  it('inject contructor parameters', () => {
    const user = containerPerpetual.construct<UserServiceMock>('UserServiceMock')
    expect(user?.userRepositoryMock.getUser()).not.toBeUndefined()
  });

  it('inject custom contructor parameters', () => {
    const service = containerRequest.construct<CustomServiceMock>('CustomServiceMock')
    expect(service?.CUSTOM).not.toBeUndefined()
  });

  
  // @Provider()
  // class UserProviderMock implements UserProviderMockInterface {
  //   public getUserFirstName(): string {
  //     return 'Eduardo'
  //   }
  // }
  
  // @Consumer()
  // class ConsumerAccountMock {
    
  //   @Consumer('UserProviderMock')
  //   accessor firstAccessorUserProviderMock!: any;
  
  //   @Consumer(UserProviderMock)
  //   accessor secondAccessorUserProviderMock!: any;
    
  //   constructor(public userProviderMock: UserProviderMockInterface) {}
  
  //   public getUserFirstName() {
  //     return this.userProviderMock.getUserFirstName()
  //   }
  
  //   public getFirstAccessorUserFirstName() {
  //     return (<UserProviderMock>this.firstAccessorUserProviderMock).getUserFirstName()
  //   }
  
  //   public getSecondAccessorUserFirstName() {
  //     return this.secondAccessorUserProviderMock.getUserFirstName()
  //   }
  // }
  
  // @Consumer({ NotFoundProvider: { optional: false }})
  // class ConsumerNotFoundProviderMock {    
  //   constructor (public notFoundProvider: any) {}
  // }
  
  // it('throws if provider do not exist and is not optional', () => {
  //   expect(() => Factory.construct(ConsumerNotFoundProviderMock)).toThrow(ProviderException)
  // });

  // const consumerAccountMock = Factory.construct(ConsumerAccountMock)

  // it('inject from constructor property', () => {
  //   expect(consumerAccountMock.getUserFirstName()).toEqual('Eduardo')
  // });

  // it('inject from field properties', () => {
  //   expect(consumerAccountMock.getFirstAccessorUserFirstName()).toEqual('Eduardo')
  //   expect(consumerAccountMock.getSecondAccessorUserFirstName()).toEqual('Eduardo')
  // });

  // it('instantiate from a provider object', () => {
  //   Container.set('ManualProviderMock', 'Eduardo');
  //   const provider = Container.construct('ManualProviderMock')
  //   expect(provider).toEqual('Eduardo')
  // });

  // it('instantiate from a provider object with class value', () => {
  //   Container.set('ManualProviderMock', ManualProviderMock);
  //   const provider = Container.construct('ManualProviderMock') as ManualProviderMock
  //   expect(provider.getUserFirstName()).toEqual('Eduardo')
  // });
});
