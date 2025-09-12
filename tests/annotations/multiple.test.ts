import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import type { DecoratorType } from '~/decorator/types.ts';

import Required from '~/validator/decorations/required.decoration.ts';
import Equal from '~/validator/decorations/equal.decoration.ts';

import Factory from '~/common/services/factory.service.ts';
import Entity from '~/entity/services/entity.service.ts';
import DecoratorMetadata from '~/decorator/services/decorator-metadata.service.ts';

describe('multiple annotation', () => {
  
  class UserEntityMock extends Entity {
    @Required()
    @Equal('Eduardo')
    firstName!: string;
  }

  it('multiple decorators', () => {
    const userSingletonMockFirst = Factory.construct(UserEntityMock, { arguments: { firstName: 'Eduardo' } });

    const decorations = DecoratorMetadata.filterByTargetPropertyKeys(userSingletonMockFirst, ['firstName'])
    const decoratorNames = decorations.map((decorator: DecoratorType) => decorator.annotation.target.constructor .name)

    expect(decoratorNames).toContain("RequiredValidation");
    expect(decoratorNames).toContain("EqualValidation");
  });
});
