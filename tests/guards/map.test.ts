import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import isMap from '~/common/guards/isMap.ts';

describe('guard', () => {
  describe('isMap', () => {
    it('should return true for Map objects', () => {
      expect(isMap(new Map())).toBe(true);
      expect(isMap(new Map([['key', 'value']]))).toBe(true);
    });

    it('should return false for non-Map values', () => {
      expect(isMap({})).toBe(false);
      expect(isMap([])).toBe(false);
      expect(isMap(null)).toBe(false);
      expect(isMap(undefined)).toBe(false);
    });
  });
});