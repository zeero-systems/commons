import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import isString from '~/common/guards/is-string.guard.ts';

describe('guard', () => {
  describe('isString', () => {
    it('should return true for string values', () => {
      expect(isString('')).toBe(true);
      expect(isString('test')).toBe(true);
      expect(isString(String('test'))).toBe(true);
      expect(isString(`template literal`)).toBe(true);
    });

    it('should return false for non-string values', () => {
      expect(isString(123)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
    });
  });
});