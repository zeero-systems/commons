import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import Mixin from '~/common/annotations/Mixin.ts';
import Required from '~/validator/annotations/Required.ts';
import Equal from '~/validator/annotations/Equal.ts';
import Factory from '~/common/services/Factory.ts';
import Entity from '~/entity/services/Entity.ts';
import Decoration from '~/decorator/services/Decoration.ts';

describe('mixin annotation', () => {
  
  class UserEntityMock extends Entity {
    @Mixin([Required(), Equal("Eduardo")])
    firstName!: string;
  }

  it('multiple decorators', () => {
    const userSingletonMockFirst = Factory.construct(UserEntityMock, { arguments: { properties: { firstName: 'Eduardo' } } });

    const decorations = Decoration.list(userSingletonMockFirst, 'firstName')
    const decoratorNames = decorations.map((decorator: any) => decorator.annotation.constructor.name)

    console.log(decorations)

    expect(decoratorNames).toContain("Required");
    expect(decoratorNames).toContain("Equal");
  });
});
