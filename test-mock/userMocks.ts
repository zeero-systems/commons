import Singleton from '~/common/decorations/Singleton.ts';
import Provider from '~/provider/decorations/Provider.ts';
import Consumer from '~/provider/decorations/Consumer.ts';

export class UserMock {
  firstName!: string;
  lastName!: string;
  created!: Date;
  email!: Array<{ isMain: boolean; address: string }>;
}

@Singleton()
export class SingletonUserMock extends UserMock {}

@Provider()
export class ServiceUserMock extends UserMock {
  hardName: string = 'Eduardo'
}

@Consumer()
export class ConsumerUserMock {
  userService: ServiceUserMock
    
  @Consumer()
  accessor serviceUserMock!: ServiceUserMock
  
  constructor (serviceUserMock: ServiceUserMock) {
    this.userService = serviceUserMock
  }

  getConstructorUserFirstName() {
    return this.userService.hardName
  }

  getAccessorUserFirstName() {
    return this.serviceUserMock.hardName
  }
}