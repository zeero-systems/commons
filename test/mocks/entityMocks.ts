import { UserType } from '-/test/mocks/commonMocks.ts';

import Entity from '~/entity/services/Entity.ts';
import Singleton from '~/common/decorations/Singleton.ts';
import { Required as RequiredValidation } from '-/test/mocks/validatorMocks.ts';
import { DecorationInterface } from '~/decorator/interfaces.ts';
import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';
import decorateFn from '~/decorator/functions/decorateFn.ts';

@Singleton()
class RequiredDecoration extends RequiredValidation implements DecorationInterface {
  group: DecoratorGroupEnum = DecoratorGroupEnum.VALIDATIONS
}

export const Required = () => decorateFn(RequiredDecoration)

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