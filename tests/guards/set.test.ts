import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import isSet from '~/common/guards/isSet.ts';

describe('guard', () => {
  describe('isSet', () => {
    it('should return true for Set objects', () => {
      expect(isSet(new Set())).toBe(true);
      expect(isSet(new Set([1, 2, 3]))).toBe(true);
    });

    it('should return false for non-Set values', () => {
      expect(isSet([])).toBe(false);
      expect(isSet({})).toBe(false);
      expect(isSet(null)).toBe(false);
      expect(isSet(undefined)).toBe(false);
    });
  });
});