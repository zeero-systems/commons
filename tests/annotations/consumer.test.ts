import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Consumer from '~/container/decorations/consumer.decoration.ts';
import { DecoratorMetadata } from '@zeero-systems/commons/services';

describe('consumer annotation', () => {
  @Consumer()
  class UserMock {
    constructor(public name: string) {}
    
    @Consumer()
    getNameById(id: number) {
      return this.name
    }
  }

  it('consumer annotation has function parameters', () => {
    const userConsumerMockFirst = new UserMock('Eduardo');

    const decorations = DecoratorMetadata.filterByAnnotationInteroperableName(userConsumerMockFirst, 'Consumer')

    expect(decorations.length).toBe(2);
  });
});
