import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import { assertSpyCalls, spy } from "@std/mock";


import Debug from '~/common/annotations/Debug.ts';
import { Debug as DebugAnnotation } from '~/common/annotations/Debug.ts';

import Entity from '~/entity/services/Entity.ts';
import Decoration from '~/decorator/services/Decoration.ts';

describe('annotation', () => {
  describe('debug', () => {
    const logSpy = spy(console, "debug");

    @Debug()
    class UserEntityMock extends Entity {
      firstName!: string;
    }
    
    it('should log instantiation message', () => {
      assertSpyCalls(logSpy, 2);
      expect(logSpy.calls[0].args[0]).not.toBeNull();
    });
    
    it('should be registered in class metadata', () => {
      const metadata = Decoration.get(UserEntityMock, 'Debug');
      expect(metadata).toBeDefined();
      expect(metadata?.annotation instanceof DebugAnnotation).toBeTruthy();
    });

  });
});