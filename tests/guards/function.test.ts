import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import isFunction from '~/common/guards/isFunction.ts';

describe('guard', () => {
  describe('isFunction', () => {
    it('should return true for function values', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(function() {})).toBe(true);
      expect(isFunction(Date)).toBe(true);
    });

    it('should return false for non-function values', () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
    });
  });
});