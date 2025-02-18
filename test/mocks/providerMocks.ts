import Provider from '~/provider/decorations/Provider.ts';
import Consumer from '~/provider/decorations/Consumer.ts';

export class AnimalNonProviderMock {
  public getSpeciesName() {
    return 'Canis lupus familiaris'
  }
}

@Provider()
export class SettingProviderMock {
  public getUserSettings() {
    return { theme: 'dark' }
  }
}

interface UserProviderMockInterface {
  getUserFirstName(): string
}

@Provider()
export class UserProviderMock implements UserProviderMockInterface {
  public getUserFirstName(): string {
    return 'Eduardo'
  }
}

@Consumer()
export class ConsumerAccountMock {
  
  @Consumer('UserProviderMock')
  accessor firstAccessorUserProviderMock!: any;

  @Consumer(UserProviderMock)
  accessor secondAccessorUserProviderMock!: any;
  
  constructor(public userProviderMock: UserProviderMockInterface) {}

  public getUserFirstName() {
    return this.userProviderMock.getUserFirstName()
  }

  public getFirstAccessorUserFirstName() {
    return (<UserProviderMock>this.firstAccessorUserProviderMock).getUserFirstName()
  }

  public getSecondAccessorUserFirstName() {
    return this.secondAccessorUserProviderMock.getUserFirstName()
  }
}

@Consumer({ NotFoundProvider: { optional: false }})
export class ConsumerNotFoundProviderMock {    
  constructor (public notFoundProvider: any) {}
}