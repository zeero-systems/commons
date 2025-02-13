
export type UserType = {
  firstName: string;
  lastName: string;
  created?: Date;
  birthDate?: Date;
  email?: Array<{ isMain: boolean; address: string }>;
};

export class UserMock implements UserType {
  firstName!: string;
  lastName!: string;
  created!: Date;
  email!: Array<{ isMain: boolean; address: string }>;
}