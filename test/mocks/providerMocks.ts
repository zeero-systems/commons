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

@Provider()
export class UserProviderMock {
  public getUserFirstName() {
    return 'Eduardo'
  }
}

@Consumer()
export class ConsumerAccountMock {
  
  @Consumer('UserProviderMock')
  accessor firstAccessorUserProviderMock!: any;

  @Consumer(UserProviderMock)
  accessor secondAccessorUserProviderMock!: any;
  
  constructor(public userProviderMock: UserProviderMock) {
    console.log(UserProviderMock.name)
  }

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