import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import isDate from '~/common/guards/isDate.ts';

describe('guard', () => {
  describe('isDate', () => {
    it('should return true for Date objects', () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date('2023-01-01'))).toBe(true);
    });

    it('should return false for non-Date values', () => {
      expect(isDate('2023-01-01')).toBe(false);
      expect(isDate(123456789)).toBe(false);
      expect(isDate(null)).toBe(false);
      expect(isDate(undefined)).toBe(false);
    });
  });
});