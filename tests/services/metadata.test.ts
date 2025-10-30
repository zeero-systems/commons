import { describe, it } from 'jsr:@std/testing@^1/bdd';
import { expect } from 'jsr:@std/expect@^1';

import Metadata from '~/common/services/metadata.service.ts';

describe('metadata', () => {
  describe('set', () => {
    it('should set metadata symbol on target constructor', () => {
      class TestClass {}
      const target = new TestClass();
      
      Metadata.set(target);
      
      expect(TestClass[Symbol.metadata]).toBeDefined();
    });

    it('should set metadata symbol on plain object', () => {
      const target: any = Object.create(null);
      
      Metadata.set(target);
      
      expect(target[Symbol.metadata]).toBeDefined();
    });

    it('should not overwrite existing metadata', () => {
      class TestClass {}
      TestClass[Symbol.metadata] = { existing: 'value' };
      const target = new TestClass();
      
      Metadata.set(target);
      
      expect(TestClass[Symbol.metadata]).toEqual({ existing: 'value' });
    });

    it('should handle target without constructor', () => {
      const target = Object.create(null);
      
      Metadata.set(target);
      
      expect(target[Symbol.metadata]).toBeDefined();
    });
  });

  describe('add', () => {
    it('should add key-value pair to metadata', () => {
      class TestClass {}
      const target = new TestClass();
      
      Metadata.add(target, 'testKey', 'testValue');
      
      const metadata = Metadata.get(target);
      expect(metadata?.testKey).toBe('testValue');
    });

    it('should create metadata if it does not exist', () => {
      class TestClass {}
      const target = new TestClass();
      
      expect(Metadata.has(target)).toBe(false);
      
      Metadata.add(target, 'key', 'value');
      
      expect(Metadata.has(target)).toBe(true);
    });

    it('should add multiple key-value pairs', () => {
      class TestClass {}
      const target = new TestClass();
      
      Metadata.add(target, 'key1', 'value1');
      Metadata.add(target, 'key2', 'value2');
      Metadata.add(target, 'key3', 'value3');
      
      const metadata = Metadata.get(target);
      expect(metadata?.key1).toBe('value1');
      expect(metadata?.key2).toBe('value2');
      expect(metadata?.key3).toBe('value3');
    });

    it('should overwrite existing key', () => {
      class TestClass {}
      const target = new TestClass();
      
      Metadata.add(target, 'key', 'original');
      Metadata.add(target, 'key', 'updated');
      
      const value = Metadata.getByKey(target, 'key');
      expect(value).toBe('updated');
    });

    it('should handle complex values', () => {
      class TestClass {}
      const target = new TestClass();
      const complexValue = { nested: { data: [1, 2, 3] } };
      
      Metadata.add(target, 'complex', complexValue);
      
      const value = Metadata.getByKey(target, 'complex');
      expect(value).toEqual(complexValue);
    });

    it('should handle symbol keys', () => {
      class TestClass {}
      const target = new TestClass();
      const symKey = Symbol('testSymbol');
      
      Metadata.add(target, symKey, 'symbolValue');
      
      const value = Metadata.getByKey(target, symKey);
      expect(value).toBe('symbolValue');
    });
  });

  describe('has', () => {
    it('should return true if metadata exists', () => {
      class TestClass {}
      const target = new TestClass();
      
      Metadata.set(target);
      
      expect(Metadata.has(target)).toBe(true);
    });

    it('should return false if metadata does not exist', () => {
      class TestClass {}
      const target = new TestClass();
      
      expect(Metadata.has(target)).toBe(false);
    });

    it('should return true after adding metadata', () => {
      class TestClass {}
      const target = new TestClass();
      
      expect(Metadata.has(target)).toBe(false);
      Metadata.add(target, 'key', 'value');
      expect(Metadata.has(target)).toBe(true);
    });
  });

  describe('get', () => {
    it('should return metadata from constructor', () => {
      class TestClass {}
      TestClass[Symbol.metadata] = { test: 'value' };
      const target = new TestClass();
      
      const metadata = Metadata.get(target);
      
      expect(metadata).toEqual({ test: 'value' });
    });

    it('should return metadata from target directly', () => {
      const target: any = {};
      target[Symbol.metadata] = { test: 'value' };
      
      const metadata = Metadata.get(target);
      
      expect(metadata).toEqual({ test: 'value' });
    });

    it('should return undefined if no metadata exists', () => {
      class TestClass {}
      const target = new TestClass();
      
      const metadata = Metadata.get(target);
      
      expect(metadata).toBeUndefined();
    });

    it('should prefer target metadata over constructor metadata', () => {
      class TestClass {}
      TestClass[Symbol.metadata] = { source: 'constructor' };
      const target: any = new TestClass();
      target[Symbol.metadata] = { source: 'target' };
      
      const metadata = Metadata.get(target);
      
      expect(metadata).toEqual({ source: 'target' });
    });
  });

  describe('getByKey', () => {
    it('should return value for existing key', () => {
      class TestClass {}
      const target = new TestClass();
      
      Metadata.add(target, 'testKey', 'testValue');
      
      const value = Metadata.getByKey(target, 'testKey');
      expect(value).toBe('testValue');
    });

    it('should return undefined for non-existent key', () => {
      class TestClass {}
      const target = new TestClass();
      
      Metadata.set(target);
      
      const value = Metadata.getByKey(target, 'nonExistent');
      expect(value).toBeUndefined();
    });

    it('should return undefined if no metadata exists', () => {
      class TestClass {}
      const target = new TestClass();
      
      const value = Metadata.getByKey(target, 'anyKey');
      expect(value).toBeUndefined();
    });

    it('should work with typed values', () => {
      class TestClass {}
      const target = new TestClass();
      
      Metadata.add(target, 'number', 42);
      Metadata.add(target, 'string', 'hello');
      Metadata.add(target, 'boolean', true);
      
      expect(Metadata.getByKey<number>(target, 'number')).toBe(42);
      expect(Metadata.getByKey<string>(target, 'string')).toBe('hello');
      expect(Metadata.getByKey<boolean>(target, 'boolean')).toBe(true);
    });

    it('should handle symbol keys', () => {
      class TestClass {}
      const target = new TestClass();
      const symKey = Symbol('test');
      
      Metadata.add(target, symKey, 'symbolValue');
      
      const value = Metadata.getByKey(target, symKey);
      expect(value).toBe('symbolValue');
    });
  });

  describe('complete workflow', () => {
    it('should handle full metadata lifecycle', () => {
      class MyClass {}
      const instance = new MyClass();
      
      // Initially no metadata
      expect(Metadata.has(instance)).toBe(false);
      
      // Add first key
      Metadata.add(instance, 'version', '1.0.0');
      expect(Metadata.has(instance)).toBe(true);
      expect(Metadata.getByKey(instance, 'version')).toBe('1.0.0');
      
      // Add more keys
      Metadata.add(instance, 'author', 'John Doe');
      Metadata.add(instance, 'tags', ['typescript', 'metadata']);
      
      // Retrieve all
      const metadata = Metadata.get(instance);
      expect(metadata?.version).toBe('1.0.0');
      expect(metadata?.author).toBe('John Doe');
      expect(metadata?.tags).toEqual(['typescript', 'metadata']);
      
      // Update existing key
      Metadata.add(instance, 'version', '2.0.0');
      expect(Metadata.getByKey(instance, 'version')).toBe('2.0.0');
    });

    it('should work with multiple instances', () => {
      class MyClass {}
      const instance1 = new MyClass();
      const instance2 = new MyClass();
      
      Metadata.add(instance1, 'id', 1);
      Metadata.add(instance2, 'id', 2);
      
      // Metadata is shared via constructor, so both will have the last value
      // This is how Symbol.metadata works in TypeScript
      const id1 = Metadata.getByKey(instance1, 'id');
      const id2 = Metadata.getByKey(instance2, 'id');
      expect(id2).toBe(2); // Last value set
      expect(id1).toBe(id2); // Both should be the same
    });
  });
});
