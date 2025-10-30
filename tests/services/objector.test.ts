import { describe, it } from 'jsr:@std/testing@^1/bdd';
import { expect } from 'jsr:@std/expect@^1';

import Objector from '~/common/services/objector.service.ts';

describe('objector', () => {
  describe('hasUniqueValues', () => {
    it('should return true for objects with unique values', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(Objector.hasUniqueValues(obj)).toBe(true);
    });

    it('should return false for objects with duplicate values', () => {
      const obj = { a: 1, b: 2, c: 1 };
      expect(Objector.hasUniqueValues(obj)).toBe(false);
    });

    it('should return true for nested objects with unique values', () => {
      const obj = { a: 1, b: { c: 2, d: 3 } };
      expect(Objector.hasUniqueValues(obj)).toBe(true);
    });

    it('should return false for nested objects with duplicate values', () => {
      const obj = { a: 1, b: { c: 1, d: 3 } };
      expect(Objector.hasUniqueValues(obj)).toBe(false);
    });

    it('should return true for arrays with unique values', () => {
      const obj = { a: [1, 2, 3] };
      expect(Objector.hasUniqueValues(obj)).toBe(true);
    });

    it('should return false for arrays with duplicate values', () => {
      const obj = { a: [1, 2, 1] };
      expect(Objector.hasUniqueValues(obj)).toBe(false);
    });

    it('should handle primitive values', () => {
      expect(Objector.hasUniqueValues(1)).toBe(true);
      expect(Objector.hasUniqueValues('test')).toBe(true);
      expect(Objector.hasUniqueValues(null)).toBe(true);
    });
  });

  describe('getKeys', () => {
    it('should return all keys from object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const keys = Objector.getKeys(obj);
      expect(keys).toEqual(['a', 'b', 'c']);
    });

    it('should return empty array for empty object', () => {
      const obj = {};
      const keys = Objector.getKeys(obj);
      expect(keys).toEqual([]);
    });

    it('should only return own keys, not inherited', () => {
      class Parent {
        parentProp = 'parent';
      }
      class Child extends Parent {
        childProp = 'child';
      }
      const obj = new Child();
      const keys = Objector.getKeys(obj);
      expect(keys).toContain('childProp');
      expect(keys).toContain('parentProp');
    });
  });

  describe('getEntries', () => {
    it('should return entries from object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const entries = Objector.getEntries(obj);
      expect(entries).toEqual([['a', 1], ['b', 2], ['c', 3]]);
    });

    it('should return empty array for empty object', () => {
      const obj = {};
      const entries = Objector.getEntries(obj);
      expect(entries).toEqual([]);
    });

    it('should handle objects with different value types', () => {
      const obj = { str: 'text', num: 42, bool: true, arr: [1, 2] };
      const entries = Objector.getEntries(obj);
      expect(entries.length).toBe(4);
      expect(entries).toContainEqual(['str', 'text']);
      expect(entries).toContainEqual(['num', 42]);
      expect(entries).toContainEqual(['bool', true]);
      expect(entries).toContainEqual(['arr', [1, 2]]);
    });
  });

  describe('deleteProperties', () => {
    it('should delete specified properties', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = Objector.deleteProperties(obj, ['b', 'd']);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should return all properties if delete list is empty', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = Objector.deleteProperties(obj, []);
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should handle non-existent properties', () => {
      const obj = { a: 1, b: 2 };
      const result = Objector.deleteProperties(obj, ['c', 'd']);
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should not mutate original object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = Objector.deleteProperties(obj, ['b']);
      expect(obj).toEqual({ a: 1, b: 2, c: 3 });
      expect(result).toEqual({ a: 1, c: 3 });
    });
  });

  describe('toEntries', () => {
    it('should convert object to entries', () => {
      const obj = {
        name: 'John',
        age: 30,
      };
      const entries = Objector.toEntries(obj);
      expect(entries).toContainEqual(['name', 'John']);
      expect(entries).toContainEqual(['age', 30]);
    });

    it('should handle nested objects', () => {
      const obj = {
        name: 'John',
        address: {
          city: 'NYC',
          zip: 10001,
        },
      };
      const entries = Objector.toEntries(obj);
      expect(entries).toContainEqual(['name', 'John']);
      expect(entries.find(([key]) => key === 'address')?.[1]).toEqual({
        city: 'NYC',
        zip: 10001,
      });
    });

    it('should handle arrays in objects', () => {
      const obj = {
        name: 'John',
        hobbies: ['reading', 'coding'],
      };
      const entries = Objector.toEntries(obj);
      expect(entries).toContainEqual(['name', 'John']);
      expect(entries).toContainEqual(['hobbies', ['reading', 'coding']]);
    });

    it('should handle nested arrays with objects', () => {
      const obj = {
        users: [
          { name: 'John', age: 30 },
          { name: 'Jane', age: 25 },
        ],
      };
      const entries = Objector.toEntries(obj);
      const usersEntry = entries.find(([key]) => key === 'users');
      expect(usersEntry?.[1]).toEqual([
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ]);
    });

    it('should respect maxDepth option', () => {
      const obj = {
        level1: {
          level2: {
            level3: {
              value: 'deep',
            },
          },
        },
      };
      const entries = Objector.toEntries(obj, { maxDepth: 1 });
      expect(entries.length).toBe(1);
      expect(entries[0][0]).toBe('level1');
    });

    it('should handle Date objects correctly', () => {
      const date = new Date('2023-01-01');
      const obj = { createdAt: date };
      const entries = Objector.toEntries(obj);
      expect(entries).toContainEqual(['createdAt', date]);
    });
  });

  describe('toPlain', () => {
    it('should convert object to plain string', () => {
      const obj = { name: 'John', age: 30 };
      const plain = Objector.toPlain(obj);
      expect(plain).toBe('name=John\nage=30');
    });

    it('should handle empty object', () => {
      const obj = {};
      const plain = Objector.toPlain(obj);
      expect(plain).toBe('');
    });

    it('should handle nested objects', () => {
      const obj = {
        name: 'John',
        address: { city: 'NYC' },
      };
      const plain = Objector.toPlain(obj);
      expect(plain).toContain('name=John');
      expect(plain).toContain('address=');
    });
  });

  describe('toJson', () => {
    it('should convert object to JSON', () => {
      const obj = {
        name: 'John',
        age: 30,
      };
      const json = Objector.toJson(obj);
      expect(json).toEqual({ name: 'John', age: 30 });
    });

    it('should handle nested objects', () => {
      const obj = {
        name: 'John',
        address: {
          city: 'NYC',
          zip: 10001,
        },
      };
      const json = Objector.toJson(obj);
      expect(json).toEqual({
        name: 'John',
        address: {
          city: 'NYC',
          zip: 10001,
        },
      });
    });

    it('should handle empty object', () => {
      const obj = {};
      const json = Objector.toJson(obj);
      expect(json).toEqual({});
    });
  });

  describe('getPropertyKeys', () => {
    it('should return all property keys', () => {
      const obj = { name: 'John', age: 30, active: true };
      const keys = Objector.getPropertyKeys(obj);
      expect(keys).toEqual(['name', 'age', 'active']);
    });

    it('should return empty array for empty object', () => {
      const obj = {};
      const keys = Objector.getPropertyKeys(obj);
      expect(keys).toEqual([]);
    });

    it('should include inherited properties', () => {
      class Parent {
        parentProp = 'parent';
      }
      class Child extends Parent {
        childProp = 'child';
      }
      const obj = new Child();
      const keys = Objector.getPropertyKeys(obj);
      expect(keys).toContain('childProp');
      expect(keys).toContain('parentProp');
    });
  });

  describe('getPropertyType', () => {
    it('should return correct type for string', () => {
      const obj = { name: 'John' };
      expect(Objector.getPropertyType(obj, 'name')).toBe('string');
    });

    it('should return correct type for number', () => {
      const obj = { age: 30 };
      expect(Objector.getPropertyType(obj, 'age')).toBe('number');
    });

    it('should return correct type for boolean', () => {
      const obj = { active: true };
      expect(Objector.getPropertyType(obj, 'active')).toBe('boolean');
    });

    it('should return correct type for object', () => {
      const obj = { data: { key: 'value' } };
      expect(Objector.getPropertyType(obj, 'data')).toBe('object');
    });

    it('should return [object Date] for Date objects', () => {
      const obj = { createdAt: new Date() };
      expect(Objector.getPropertyType(obj, 'createdAt')).toBe('[object Date]');
    });

    it('should return correct type for array', () => {
      const obj = { items: [1, 2, 3] };
      expect(Objector.getPropertyType(obj, 'items')).toBe('object');
    });

    it('should return undefined for undefined property', () => {
      const obj = { name: undefined };
      expect(Objector.getPropertyType(obj, 'name')).toBe('undefined');
    });
  });

  describe('assign', () => {
    it('should assign properties from source to target', () => {
      const target = { a: 1 };
      const source = { b: 2, c: 3 };
      const result = Objector.assign(target, source);
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
      expect(result).toBe(target);
    });

    it('should override existing properties', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const result = Objector.assign(target, source);
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should handle multiple sources', () => {
      const target = { a: 1 };
      const source1 = { b: 2 };
      const source2 = { c: 3 };
      const result = Objector.assign(target, source1, source2);
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should assign inherited properties from prototype chain', () => {
      class Parent {
        parentMethod() {
          return 'parent';
        }
      }
      class Child extends Parent {
        childMethod() {
          return 'child';
        }
      }
      const target = {};
      const source = new Child();
      const result = Objector.assign(target, source);
      expect(typeof (result as any).childMethod).toBe('function');
      expect(typeof (result as any).parentMethod).toBe('function');
    });

    it('should preserve property descriptors', () => {
      const target = {};
      const source = {};
      Object.defineProperty(source, 'readonly', {
        value: 42,
        writable: false,
        enumerable: true,
        configurable: true,
      });
      const result = Objector.assign(target, source);
      const descriptor = Object.getOwnPropertyDescriptor(result, 'readonly');
      expect(descriptor?.writable).toBe(false);
      expect((result as any).readonly).toBe(42);
    });
  });
});
