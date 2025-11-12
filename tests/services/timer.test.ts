import { describe, it } from 'jsr:@std/testing@^1/bdd';
import { expect } from 'jsr:@std/expect@^1';

import Timer from '~/common/services/timer.service.ts';

describe('timer', () => {
  describe('setTime', () => {
    it('should set a timer with default key', () => {
      const timer = new Timer();
      timer.setTime();
      expect(timer.timers.has('default')).toBe(true);
    });

    it('should set a timer with custom key', () => {
      const timer = new Timer();
      timer.setTime('custom');
      expect(timer.timers.has('custom')).toBe(true);
    });

    it('should store start time', () => {
      const timer = new Timer();
      const before = performance.now();
      timer.setTime('test');
      const after = performance.now();
      
      const time = timer.timers.get('test');
      expect(time).toBeDefined();
      expect(time!.start).toBeGreaterThanOrEqual(before);
      expect(time!.start).toBeLessThanOrEqual(after);
    });

    it('should initialize end and duration to 0', () => {
      const timer = new Timer();
      timer.setTime('test');
      
      const time = timer.timers.get('test');
      expect(time!.end).toBe(0);
      expect(time!.duration).toBe(0);
    });

    it('should allow multiple timers', () => {
      const timer = new Timer();
      timer.setTime('timer1');
      timer.setTime('timer2');
      timer.setTime('timer3');
      
      expect(timer.timers.size).toBe(3);
      expect(timer.timers.has('timer1')).toBe(true);
      expect(timer.timers.has('timer2')).toBe(true);
      expect(timer.timers.has('timer3')).toBe(true);
    });
  });

  describe('endTime', () => {
    it('should end a timer with default key', () => {
      const timer = new Timer();
      timer.setTime();
      timer.endTime();
      
      const time = timer.timers.get('default');
      expect(time!.end).toBeGreaterThan(0);
      expect(time!.duration).toBeGreaterThanOrEqual(0);
    });

    it('should end a timer with custom key', () => {
      const timer = new Timer();
      timer.setTime('custom');
      timer.endTime('custom');
      
      const time = timer.timers.get('custom');
      expect(time!.end).toBeGreaterThan(0);
      expect(time!.duration).toBeGreaterThanOrEqual(0);
    });

    it('should calculate duration correctly', () => {
      const timer = new Timer();
      timer.setTime('test');
      
      const start = performance.now();
      while (performance.now() - start < 5) { }
      
      timer.endTime('test');
      
      const time = timer.timers.get('test');
      expect(time!.duration).toBeGreaterThan(0);
      expect(time!.duration).toBe(time!.end - time!.start);
    });

    it('should handle non-existent timer gracefully', () => {
      const timer = new Timer();
      timer.endTime('nonexistent');
      
      expect(timer.timers.has('nonexistent')).toBe(false);
    });
  });

  describe('getTime', () => {
    it('should return timer and delete it', () => {
      const timer = new Timer();
      timer.setTime('test');
      timer.endTime('test');
      
      const time = timer.getTime('test');
      expect(time).toBeDefined();
      expect(time!.key).toBe('test');
      expect(timer.timers.has('test')).toBe(false);
    });

    it('should return undefined for non-existent timer', () => {
      const timer = new Timer();
      const time = timer.getTime('nonexistent');
      expect(time).toBeUndefined();
    });

    it('should work with default key', () => {
      const timer = new Timer();
      timer.setTime();
      timer.endTime();
      
      const time = timer.getTime();
      expect(time).toBeDefined();
      expect(time!.key).toBe('default');
    });

    it('should return time even if not ended', () => {
      const timer = new Timer();
      timer.setTime('incomplete');
      
      const time = timer.getTime('incomplete');
      expect(time).toBeDefined();
      expect(time!.end).toBe(0);
      expect(time!.duration).toBe(0);
    });
  });

  describe('Symbol.dispose', () => {
    it('should clear all timers', () => {
      const timer = new Timer();
      timer.setTime('timer1');
      timer.setTime('timer2');
      timer.setTime('timer3');
      
      expect(timer.timers.size).toBe(3);
      
      timer[Symbol.dispose]();
      
      expect(timer.timers.size).toBe(0);
    });
  });

  describe('complete workflow', () => {
    it('should handle complete timer lifecycle', () => {
      const timer = new Timer();
      
      
      timer.setTime('workflow');
      expect(timer.timers.has('workflow')).toBe(true);

      const start = performance.now();
      while (performance.now() - start < 5) { }
      
      timer.endTime('workflow');

      const time = timer.getTime('workflow');
      expect(time).toBeDefined();
      expect(time!.duration).toBeGreaterThan(0);
      expect(time!.end).toBeGreaterThan(time!.start);
      expect(timer.timers.has('workflow')).toBe(false);
    });

    it('should handle multiple concurrent timers', () => {
      const timer = new Timer();
      
      timer.setTime('task1');
      timer.setTime('task2');
      timer.endTime('task1');
      timer.setTime('task3');
      timer.endTime('task2');
      timer.endTime('task3');
      
      const time1 = timer.getTime('task1');
      const time2 = timer.getTime('task2');
      const time3 = timer.getTime('task3');
      
      expect(time1).toBeDefined();
      expect(time2).toBeDefined();
      expect(time3).toBeDefined();
      expect(timer.timers.size).toBe(0);
    });
  });
});
