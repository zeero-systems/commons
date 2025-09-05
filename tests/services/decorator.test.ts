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

  const RequiredAnnotation = (): DecoratorFunctionType => Decorator.apply(Required);

  class User {
    @RequiredAnnotation()
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

  it('metadata with both property and name', () => {
    const decoration = Decoration.get(user, 'firstName', 'required');

    expect(decoration).toBeDefined();
    expect(decoration?.property).toEqual('firstName');
  });

  it('metadata with dot notation', () => {
    const decoration = Decoration.get(user, 'firstName.required');

    expect(decoration).toBeDefined();
    expect(decoration?.property).toEqual('firstName');
  });
});