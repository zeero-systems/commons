import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import isWeakMap from '~/common/guards/is-weak-map.guard.ts';

describe('guard', () => {
  describe('isWeakMap', () => {
    it('should return true for WeakMap objects', () => {
      expect(isWeakMap(new WeakMap())).toBe(true);
      const obj = {};
      const weakMap = new WeakMap([[obj, 'value']]);
      expect(isWeakMap(weakMap)).toBe(true);
    });

    it('should return false for non-WeakMap values', () => {
      expect(isWeakMap(new Map())).toBe(false);
      expect(isWeakMap({})).toBe(false);
      expect(isWeakMap(null)).toBe(false);
      expect(isWeakMap(undefined)).toBe(false);
    });
  });
});