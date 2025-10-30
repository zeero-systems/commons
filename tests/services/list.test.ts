import { describe, it } from 'jsr:@std/testing@^1/bdd';
import { expect } from 'jsr:@std/expect@^1';

import List from '~/common/services/list.service.ts';

describe('list', () => {
  describe('getSortedIndex', () => {
    it('should return index for inserting into empty array', () => {
      const arr: number[] = [];
      const index = List.getSortedIndex(arr, () => false);
      expect(index).toBe(0);
    });

    it('should find index where predicate becomes false', () => {
      const arr = [10, 20, 30, 40, 50];
      // Find first index where (current >= 25) i.e., where (25 < current) is false becomes (current <= 25) is true
      // Actually, isLessThan true means "keep looking right", false means "found it or go left"
      // With (value < current): if true for element, search continues right (low = mid+1)
      //                        if false, element is >= value, search goes left or stops (high = mid)
      // So it finds first element where isLessThan is FALSE
      
      // For sorted insertion: use (value >= current) to find where value should go
      // Element 25 should go before 30 (index 2)
      const index = List.getSortedIndex(arr, (current) => 25 >= current);
      expect(index).toBe(2);
    });

    it('should work when value should be at start', () => {
      const arr = [10, 20, 30, 40, 50];
      const index = List.getSortedIndex(arr, (current) => 5 >= current);
      expect(index).toBe(0);
    });

    it('should work when value should be at end', () => {
      const arr = [10, 20, 30, 40, 50];
      const index = List.getSortedIndex(arr, (current) => 60 >= current);
      expect(index).toBe(5);
    });

    it('should handle single element array', () => {
      const arr = [10];
      const indexBefore = List.getSortedIndex(arr, (current) => 5 >= current);
      const indexAfter = List.getSortedIndex(arr, (current) => 15 >= current);
      
      expect(indexBefore).toBe(0);
      expect(indexAfter).toBe(1);
    });

    it('should work with object arrays', () => {
      const arr = [
        { id: 1, value: 10 },
        { id: 2, value: 20 },
        { id: 3, value: 30 },
        { id: 4, value: 40 },
      ];
      const index = List.getSortedIndex(arr, (current) => 25 >= current.value);
      expect(index).toBe(2);
    });

    it('should work with string arrays', () => {
      const arr = ['apple', 'banana', 'cherry', 'date'];
      const index = List.getSortedIndex(arr, (current) => 'blueberry' >= current);
      expect(index).toBe(2);
    });

    it('should handle duplicate values', () => {
      const arr = [10, 20, 20, 20, 30];
      const index = List.getSortedIndex(arr, (current) => 20 >= current);
      // Finds first position where 20 >= current is false, i.e., current > 20
      expect(index).toBe(4);
    });

    it('should use binary search efficiently', () => {
      // Create large sorted array
      const arr = Array.from({ length: 1000 }, (_, i) => i * 10);
      const target = 500 * 10; // 5000 is already at index 500
      const index = List.getSortedIndex(arr, (current) => target >= current);
      
      // Should return 501 (after the existing 5000)
      expect(index).toBe(501);
    });

    it('should handle predicate always true', () => {
      const arr = [1, 2, 3, 4, 5];
      const index = List.getSortedIndex(arr, () => true);
      expect(index).toBe(5);
    });

    it('should handle predicate always false', () => {
      const arr = [10, 20, 30, 40, 50];
      const index = List.getSortedIndex(arr, () => false);
      expect(index).toBe(0);
    });
  });
});
