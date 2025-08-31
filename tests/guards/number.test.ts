import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import isNumber from '~/common/guards/isNumber.ts';

describe('guard', () => {
  describe('isNumber', () => {
    it('should return true for number values', () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(1.5)).toBe(true);
      expect(isNumber(Number.MAX_VALUE)).toBe(true);
      expect(isNumber(Number.MIN_VALUE)).toBe(true);
    });

    it('should return false for non-number values', () => {
      expect(isNumber('123')).toBe(false);
      expect(isNumber(BigInt(123))).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
    });
  });
});