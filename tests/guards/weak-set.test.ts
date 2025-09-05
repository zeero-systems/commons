import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import isWeakSet from '~/common/guards/is-weak-set.guard.ts';

describe('guard', () => {
  describe('isWeakSet', () => {
    it('should return true for WeakSet objects', () => {
      expect(isWeakSet(new WeakSet())).toBe(true);
      const obj = {};
      const weakSet = new WeakSet([obj]);
      expect(isWeakSet(weakSet)).toBe(true);
    });

    it('should return false for non-WeakSet values', () => {
      expect(isWeakSet(new Set())).toBe(false);
      expect(isWeakSet({})).toBe(false);
      expect(isWeakSet(null)).toBe(false);
      expect(isWeakSet(undefined)).toBe(false);
    });
  });
});