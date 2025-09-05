import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import { assertSpyCalls, spy } from "@std/mock";


import Debug from '~/common/annotations/debug.annotation.ts';
import { Debug as DebugAnnotation } from '~/common/annotations/debug.annotation.ts';

import Entity from '~/entity/services/entity.service.ts';
import Decoration from '~/decorator/services/decoration.service.ts';
import Singleton from '~/common/annotations/singleton.annotation.ts';

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
      const metadata = Decoration.get(UserEntityMock, 'construct.debug');
      expect(metadata).toBeDefined();
      expect(metadata?.annotation instanceof DebugAnnotation).toBeTruthy();
    });

  });
});
