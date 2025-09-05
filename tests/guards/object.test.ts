import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import isObject from '~/common/guards/is-object.guard.ts';

describe('guard', () => {
  describe('isObject', () => {
    it('should return true for object values', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ key: 'value' })).toBe(true);
      expect(isObject(new Object())).toBe(true);
    });

    it('should return false for non-object values', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject('string')).toBe(false);
      expect(isObject(123)).toBe(false);
    });
  });
});