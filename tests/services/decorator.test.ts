import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import { AnnotationInterface, Decorator, Factory, Metadata } from '@zeero-systems/commons';
import { DecorationMetadataMapType, DecorationType, DecoratorFunctionType } from '~/decorator/types.ts';
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

  it('metadata', () => {
    const metadata = Metadata.getByKey<DecorationMetadataMapType>(user, Decorator.metadata);
    
    expect(metadata).toBeDefined();
    expect(metadata?.get('firstName')).toBeDefined();
    expect(metadata?.get('firstName')?.[0].property).toEqual('firstName');
  });
});