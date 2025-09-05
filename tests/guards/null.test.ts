import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import isNull from '~/common/guards/is-null.guard.ts';

describe('guard', () => {
  describe('isNull', () => {
    it('should return true for null values', () => {
      expect(isNull(null)).toBe(true);
    });

    it('should return false for non-null values', () => {
      expect(isNull(undefined)).toBe(false);
      expect(isNull(0)).toBe(false);
      expect(isNull('')).toBe(false);
      expect(isNull(false)).toBe(false);
    });
  });
});