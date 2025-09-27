import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Container from '~/container/services/container.service.ts';
import Consumer from '~/container/decorations/consumer.decoration.ts';

describe('container', () => {

  interface UserMockInterface {
    getUserFirstName(): string
  }

  class UserMock implements UserMockInterface {
    public getUserFirstName(): string {
      return 'Eduardo'
    }
  }

  class UserRepositoryMock {
    public getUser(): any {
      return { name: 'Eduardo' }
    }
  }

  @Consumer('UserRepositoryMock', 'userRepositoryMock')
  class UserServiceMock {
    constructor(public userRepositoryMock: UserRepositoryMock) {}

    @Consumer()
    getUserFromRepository(userRepositoryMock: UserRepositoryMock | any) {
      return userRepositoryMock.getUser()
    }
  }

  @Consumer()
  class CustomServiceMock {
    constructor(public LATER: any) {}
  }

  @Consumer()
  class PropertyMock {
    constructor(public LATER: any) {}
  }

  @Consumer()
  class AnotherServiceMock {
    @Consumer()
    userRepositoryMock!: UserRepositoryMock

    @Consumer(PropertyMock.name)
    differentePropertyName!: PropertyMock

    @Consumer('LATER')
    textPropertyName!: any
  }


  const consumers = [
    { name: UserServiceMock.name, target: UserServiceMock },
    { name: CustomServiceMock.name, target: CustomServiceMock },
    { name: PropertyMock.name, target: PropertyMock },
    { name: AnotherServiceMock.name, target: AnotherServiceMock }
  ]
  
  const providers = [
    { name: UserMock.name, target: UserMock },
    { name: UserRepositoryMock.name, target: UserRepositoryMock },
    { name: CustomServiceMock.name, target: CustomServiceMock },
    { name: PropertyMock.name, target: PropertyMock },
    {
      name: 'LATER', 
      target: { email: 'test@email.com' }
    }
  ]

  const customContainer = new Container({ providers, consumers })
  
  const containerRequest = new Container({ providers, consumers })
  
  const anotherService = containerRequest.construct<AnotherServiceMock>('AnotherServiceMock')

  it('instantiate from container', () => {
    const user = customContainer.construct('UserMock')
    expect(user).not.toBeUndefined()
  });

  it('instantiate from container isolation', () => {
    containerRequest.construct<CustomServiceMock>('UserMock')
    expect(!customContainer.instances.has('CustomServiceMock')).toBe(true)
  })

  it('inject contructor parameters', () => {
    const user = customContainer.construct<UserServiceMock>('UserServiceMock')
    expect(user?.userRepositoryMock?.getUser()).not.toBeUndefined()
  });
  
  it('inject contructor parameters from put', () => {
    const service = containerRequest.construct<CustomServiceMock>('CustomServiceMock')
    expect(service?.LATER).not.toBeUndefined()
  });
  
  it('inject from method parameters', () => {
    const user = customContainer.construct<UserServiceMock>('UserServiceMock')
    expect(user?.getUserFromRepository(undefined).name).toEqual('Eduardo')
  });

  it('inject from field properties', () => {
    expect(anotherService?.userRepositoryMock.getUser().name).toEqual('Eduardo')
  });

  it('inject from field properties from class', () => {
    expect(anotherService?.differentePropertyName.LATER).not.toBeUndefined()
  });

  it('inject from field properties from text', () => {
    expect(anotherService?.textPropertyName.email).toEqual('test@email.com')
  });
  
  const testContainer = new Container({ consumers, providers })
  const newContainer = testContainer.duplicate()

  it('instances from a container create method', () => {
    const userServiceMock = newContainer.construct<UserServiceMock>('UserServiceMock')

    expect(testContainer.instances.size).toEqual(0)
    expect(newContainer.instances.size).toEqual(2)

    const anotherService = testContainer.construct<AnotherServiceMock>('AnotherServiceMock')

    expect(anotherService?.userRepositoryMock.getUser().name).toEqual('Eduardo')
    expect(anotherService?.differentePropertyName.LATER.email).toEqual('test@email.com')
    expect(anotherService?.textPropertyName.email).toEqual('test@email.com')

    expect(testContainer.instances.size).toEqual(3)
    expect(newContainer.instances.size).toEqual(2)
  });

});
