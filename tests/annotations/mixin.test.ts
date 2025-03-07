import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import Mixin from '~/common/annotations/Mixin.ts';
import Required from '~/validator/annotations/Required.ts';
import Equal from '~/validator/annotations/Equal.ts';
import Factory from '~/common/services/Factory.ts';
import Entity from '~/entity/services/Entity.ts';
import Metadata from '~/common/services/Metadata.ts';
import Decorator from '~/decorator/services/Decorator.ts';

describe('mixin annotation', () => {
  
  class UserEntityMock extends Entity {
    @Mixin([Required(), Equal("Eduardo")])
    firstName!: string;
  }

  it('multiple decorators', () => {
    const userSingletonMockFirst = Factory.construct(UserEntityMock, { arguments: { firstName: 'Eduardo' } });

    const decorators = Metadata.getProperty(userSingletonMockFirst, Decorator.metadata)
    const decoratorNames = decorators.get('firstName').map((decorator: any) => decorator.annotation.constructor.name)

    expect(decoratorNames).toContain("Required");
    expect(decoratorNames).toContain("Equal");
  });
});
