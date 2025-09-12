import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import { assertSpyCalls, spy } from "@std/mock";


import Debug from '~/common/decorations/debug.decoration.ts';
import Singleton from '~/common/decorations/singleton.decoration.ts';
import DebugAnnotation from '~/common/annotations/debug.annotation.ts';

import Entity from '~/entity/services/entity.service.ts';
import Metadata from '~/decorator/services/decorator-metadata.service.ts';

describe('annotation', () => {
  describe('debug', () => {
    const logSpy = spy(console, "debug");

    @Debug()
    @Singleton()
    class UserEntityMock extends Entity {
      firstName!: string;
    }
    
    it('should log instantiation message', () => {
      assertSpyCalls(logSpy, 2);
      expect(logSpy.calls[0].args[0]).not.toBeNull();
    });
    
    it('should be registered in class metadata', () => {
      const metadata = Metadata.getByAnnotationInteroperableName(UserEntityMock, 'debug');
      expect(metadata).toBeDefined();
      expect(metadata?.annotation.target instanceof DebugAnnotation).toBeTruthy();
    });

  });
});
