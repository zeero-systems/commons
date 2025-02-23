import { UserType } from '-/test/mocks/commonMocks.ts';

import Entity from '~/entity/services/Entity.ts';
import { Required } from '-/test/mocks/validatorMocks.ts';
import Decorator from '~/decorator/services/Decorator.ts';

export const RequiredDecoration = () => Decorator.apply(Required)

export class UserEntityMock extends Entity implements UserType {
  firstName!: string;
  lastName!: string;
  created!: Date;
  birthDate?: Date;
  email?: Array<{ isMain: boolean; address: string }>;
}

export class RequiredEntityMock extends Entity {
  firstName!: string;
  @RequiredDecoration()
  lastName!: string;
  @RequiredDecoration()
  birthDate?: Date;
}