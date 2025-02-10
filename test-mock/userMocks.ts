import Singleton from '~/decorator/decorations/Singleton.ts';

export class UserMock {
  firstName!: string;
  lastName!: string;
  created!: Date;
  email!: Array<{ isMain: boolean; address: string }>;
}

@Singleton()
export class SingletonUserMock extends UserMock {}
