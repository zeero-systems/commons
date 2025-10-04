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
    name: string = 'DifferentName'

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

  const user = Factory.properties(User, { firstName: 'eduardo', lastName: 'segura' });

  it('decoration with both property and name', () => {
    const decoration = DecoratorMetadata.findByAnnotationClassName(user, 'RequiredValidation', 'firstName');

    expect(decoration).toBeDefined();
  });

  it('decoration filter by property', () => {
    const decoration = DecoratorMetadata.findByTargetPropertyKey(user, 'firstName');

    expect(decoration).toBeDefined();
  });

  it('decoration filter by type', () => {
    const decoration = DecoratorMetadata.findByAnnotationClassName(user, 'RequiredValidation');

    expect(decoration).toBeDefined();
  });

  it('decoration with interoperable name', () => {
    const decoration = DecoratorMetadata.findByAnnotationInteroperableName(user, 'DifferentName');

    expect(decoration).toBeDefined();
  })
});