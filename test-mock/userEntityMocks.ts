import Entity from '~/entity/services/Entity.ts';
import Required from '~/validator/decorations/Required.ts';
import Singleton from '../src/common/decorations/Singleton.ts';

export type UserEntityType = {
  firstName: string;
  lastName: string;
  created?: Date;
  birthDate?: Date;
  email?: Array<{ isMain: boolean; address: string }>;
};

export class UserEntityMock extends Entity implements UserEntityType {
  firstName!: string;
  lastName!: string;
  created!: Date;
  birthDate?: Date;
  email?: Array<{ isMain: boolean; address: string }>;
}

@Singleton()
export class SingletonUserEntityMock extends Entity implements UserEntityType {
  firstName!: string;
  lastName!: string;
  created?: Date;
  @Required()
  birthDate?: Date;
  email!: Array<{ isMain: boolean; address: string }>;
}
