import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import isSymbol from '~/common/guards/isSymbol.ts';

describe('guard', () => {
  describe('isSymbol', () => {
    it('should return true for symbol values', () => {
      expect(isSymbol(Symbol())).toBe(true);
      expect(isSymbol(Symbol('test'))).toBe(true);
      expect(isSymbol(Symbol.for('test'))).toBe(true);
    });

    it('should return false for non-symbol values', () => {
      expect(isSymbol('symbol')).toBe(false);
      expect(isSymbol({})).toBe(false);
      expect(isSymbol(null)).toBe(false);
      expect(isSymbol(undefined)).toBe(false);
    });
  });
});