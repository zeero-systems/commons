import { UserType } from '-/test/mocks/commonMocks.ts';

import Entity from '~/entity/services/Entity.ts';
import Required from '~/validator/decorations/Required.ts';

export class UserEntityMock extends Entity implements UserType {
  firstName!: string;
  lastName!: string;
  created!: Date;
  birthDate?: Date;
  email?: Array<{ isMain: boolean; address: string }>;
}

export class RequiredEntityMock extends Entity {
  @Required()
  birthDate?: Date;
}