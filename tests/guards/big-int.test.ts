import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import isBigInt from '~/common/guards/is-big-int.guard.ts';

describe('guard', () => {
  describe('isBigInt', () => {
    it('should return true for BigInt values', () => {
      expect(isBigInt(BigInt(123))).toBe(true);
      expect(isBigInt(123n)).toBe(true);
    });

    it('should return false for non-BigInt values', () => {
      expect(isBigInt(123)).toBe(false);
      expect(isBigInt('123')).toBe(false);
      expect(isBigInt(null)).toBe(false);
      expect(isBigInt(undefined)).toBe(false);
    });
  });
});