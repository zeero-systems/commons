import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Singleton from '~/common/decorations/singleton.decoration.ts';

describe('singleton annotation', () => {
  @Singleton()
  class UserMock {
    firstName!: string;
    lastName!: string;
    created!: Date;
    email!: Array<{ isMain: boolean; address: string }>;
  }

  it('has same instance', () => {
    const userSingletonMockFirst = new UserMock();
    const userSingletonMockSecond = new UserMock();

    expect(userSingletonMockFirst === userSingletonMockSecond).toBe(true);
  });
});
