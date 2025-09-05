import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import isClass from '~/common/guards/is-class.guard.ts';

describe('guard', () => {
  describe('isClass', () => {
    class TestClass {}

    it('should return true for class definitions', () => {
      expect(isClass(TestClass)).toBe(true);
      expect(isClass(class {})).toBe(true);
    });

    it('should return false for non-class values', () => {
      expect(isClass(() => {})).toBe(false);
      expect(isClass({})).toBe(false);
      expect(isClass(null)).toBe(false);
      expect(isClass(undefined)).toBe(false);
    });
  });
});