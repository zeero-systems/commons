import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import type { ArtifactType } from '~/common/types.ts';
import type { DecoratorFunctionType, DecoratorType  } from '~/decorator/types.ts';
import type { AnnotationInterface } from '~/decorator/interfaces.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import DecoratorMetadata from '~/decorator/services/decorator-metadata.service.ts';
import Factory from '~/common/services/factory.service.ts';
import Required from '~/validator/validations/required.validation.ts';

describe('decorator', () => {

  class TestAnnotation implements AnnotationInterface {
    name?: string | undefined = 'DifferentName'

    onAttach(_artifact: ArtifactType, _decorator: DecoratorType) { }

    onInitialize(_artifact: ArtifactType, _decorator: DecoratorType) { }
  }

  const RequiredDecoration = (): DecoratorFunctionType => Decorator.use(Required);
  const TestDecoration = (): DecoratorFunctionType => Decorator.use(TestAnnotation);

  class User {
    @RequiredDecoration()
    @TestDecoration()
    firstName!: string;
    lastName!: string;
  }

  const user = Factory.construct(User, {
    arguments: {
      firstName: 'eduardo',
      lastName: 'segura',
    },
  });

  it('decoration with both property and name', () => {
    const decoration = DecoratorMetadata.filter(user, ['firstName'], ['RequiredValidation']);

    expect(decoration).toBeDefined();
    expect(decoration.get('firstName')).not.toBeUndefined();
  });

  it('decoration filter by property', () => {
    const decoration = DecoratorMetadata.filterDecorationsByPropertyKeys(user, ['firstName']);

    expect(decoration).toBeDefined();
    expect(decoration.length).toEqual(2);
  });

  it('decoration filter by type', () => {
    const decoration = DecoratorMetadata.filterDecorationsByAnnotationNames(user, ['RequiredValidation']);

    expect(decoration).toBeDefined();
    expect(decoration.length).toEqual(1);
  });

  it('decoration with different name', () => {
    const decoration = DecoratorMetadata.filterDecorationsByAnnotationNames(user, ['TestAnnotation']);

    expect(decoration[0].annotation.target.name).toEqual('DifferentName');
  })
});