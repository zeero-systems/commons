import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import type { DecoratorType } from '~/decorator/types.ts';

import Required from '~/validator/validations/required.validation.ts';
import Equal from '~/validator/validations/equal.validation.ts';

import Factory from '~/common/services/factory.service.ts';
import Entity from '~/entity/services/entity.service.ts';
import DecoratorMetadata from '~/decorator/services/decorator-metadata.service.ts';
import Use from '~/decorator/services/decorator-use.service.ts';

describe('multiple annotation', () => {
  
  class UserEntityMock extends Entity {
    @Use(Required)
    @Use(Equal, { comparison: 'Eduardo' })
    firstName!: string;
  }

  it('multiple decorators', () => {
    const userSingletonMockFirst = Factory.construct(UserEntityMock, { arguments: { firstName: 'Eduardo' } });

    const decorations = DecoratorMetadata.filterDecorationsByPropertyKeys(userSingletonMockFirst, ['firstName'])
    const decoratorNames = decorations.map((decorator: DecoratorType) => decorator.annotation.target.constructor.name)

    expect(decoratorNames).toContain("Required");
    expect(decoratorNames).toContain("Equal");
  });
});
