import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import { AnnotationInterface, Decoration, Decorator, Factory } from '@zeero-systems/commons';
import { DecorationType, DecoratorFunctionType } from '~/decorator/types.ts';
import { ArtifactType } from '~/common/types.ts';

describe('decorator', () => {

  class Required implements AnnotationInterface {
    onAttach<P>(artifact: ArtifactType, _decoration: DecorationType<P>) {
      return artifact.target
    }
  }

  class Test implements AnnotationInterface {
    onAttach<P>(artifact: ArtifactType, _decoration: DecorationType<P>) {
      return artifact.target
    }
  }

  const RequiredAnnotation = (): DecoratorFunctionType => Decorator.apply(Required);
  const TestAnnotation = (): DecoratorFunctionType => Decorator.apply(Test);

  class User {
    @RequiredAnnotation()
    @TestAnnotation()
    firstName!: string;
    lastName!: string;
  }

  const user = Factory.construct(User, {
    arguments: {
      properties: {
        firstName: 'eduardo',
        lastName: 'segura',
      }
    },
  });

  it('decoration with both property and name', () => {
    const decoration = Decoration.get(user, 'firstName', 'required');

    expect(decoration).toBeDefined();
    expect(decoration?.property).toEqual('firstName');
  });

  it('decoration with dot notation', () => {
    const decoration = Decoration.get(user, 'firstName.required');

    expect(decoration).toBeDefined();
    expect(decoration?.property).toEqual('firstName');
  });

  it('decoration list by property', () => {
    const decoration = Decoration.list(user, 'firstName');

    expect(decoration).toBeDefined();
    expect(decoration.length).toEqual(2);
  });

  it('decoration list by type', () => {
    const decoration = Decoration.list(user, ['required']);

    expect(decoration).toBeDefined();
    expect(decoration.length).toEqual(1);
  });
});