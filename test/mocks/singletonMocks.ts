import { UserType } from './commonMocks.ts';

import Singleton from '~/common/decorations/Singleton.ts';

@Singleton()
export class SingletonUserMock implements UserType {
  firstName!: string;
  lastName!: string;
  created!: Date;
  email!: Array<{ isMain: boolean; address: string }>;
}
