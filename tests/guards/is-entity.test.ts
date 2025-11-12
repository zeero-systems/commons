import { describe, it } from 'jsr:@std/testing@^1/bdd';
import { expect } from 'jsr:@std/expect@^1';

import isEntity from '~/entity/guards/is-entity.guard.ts';
import Entity from '~/entity/services/entity.service.ts';

describe('guard', () => {
  describe('isEntity', () => {
    it('should return true for Entity instances', () => {
      class TestEntity extends Entity {
        name = 'test';
      }
      const entity = new TestEntity();
      expect(isEntity(entity)).toBe(true);
    });

    it('should return true for objects implementing EntityInterface', () => {
      const mockEntity = {
        validateProperty: () => Promise.resolve([]),
        validateProperties: () => Promise.resolve(undefined),
        getPropertyKeys: () => [],
        toJson: () => ({}),
        toPlain: () => '',
        toEntries: () => [],
        getPropertyType: () => 'string',
      };
      expect(isEntity(mockEntity)).toBe(true);
    });

    it('should return false for non-entity objects', () => {
      const obj = { name: 'test', age: 30 };
      expect(isEntity(obj)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isEntity(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isEntity(undefined)).toBe(false);
    });

    it('should return false for primitive values', () => {
      expect(isEntity('string')).toBe(false);
      expect(isEntity(123)).toBe(false);
      expect(isEntity(true)).toBe(false);
    });

    it('should return false for arrays', () => {
      expect(isEntity([])).toBe(false);
      expect(isEntity([1, 2, 3])).toBe(false);
    });

    it('should return false for objects with partial interface', () => {
      const partial = {
        validateProperty: () => Promise.resolve([]),
      };
      expect(isEntity(partial)).toBe(false);
    });
  });
});
