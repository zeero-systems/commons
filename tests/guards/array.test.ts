import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import isArray from '~/common/guards/is-array.guard.ts';

describe('guard', () => {
  describe('isArray', () => {
    it('should identify arrays correctly', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray({})).toBe(false);
      expect(isArray('test')).toBe(false);
    });
  });
});