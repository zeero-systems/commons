import { UserType } from '-/test/mocks/commonMocks.ts';

import Singleton from '~/common/annotations/Singleton.ts';

@Singleton()
export class SingletonUserMock implements UserType {
  firstName!: string;
  lastName!: string;
  created!: Date;
  email!: Array<{ isMain: boolean; address: string }>;
}
