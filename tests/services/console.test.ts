import { describe, it } from 'jsr:@std/testing@^1/bdd';
import { expect } from 'jsr:@std/expect@^1';

import Console from '~/common/services/console.service.ts';

describe('console', () => {
  describe('reset code', () => {
    it('should have reset code', () => {
      expect(Console.reset).toBe('\x1b[0m');
    });
  });

  describe('gray color codes', () => {
    it('should have darkest gray', () => {
      expect(Console.gray.darkest).toBe('\x1b[30m');
    });

    it('should have dark gray', () => {
      expect(Console.gray.dark).toBe('\x1b[90m');
    });

    it('should have medium gray', () => {
      expect(Console.gray.medium).toBe('\x1b[2m\x1b[37m');
    });

    it('should have light gray', () => {
      expect(Console.gray.light).toBe('\x1b[37m');
    });

    it('should have lightest gray', () => {
      expect(Console.gray.lightest).toBe('\x1b[97m');
    });
  });

  describe('red color codes', () => {
    it('should have darkest red', () => {
      expect(Console.red.darkest).toBe('\x1b[31m');
    });

    it('should have dark red', () => {
      expect(Console.red.dark).toBe('\x1b[91m');
    });

    it('should have medium red', () => {
      expect(Console.red.medium).toBe('\x1b[31m\x1b[1m');
    });

    it('should have light red', () => {
      expect(Console.red.light).toBe('\x1b[91m\x1b[2m');
    });

    it('should have lightest red', () => {
      expect(Console.red.lightest).toBe('\x1b[31m\x1b[2m');
    });
  });

  describe('yellow color codes', () => {
    it('should have darkest yellow', () => {
      expect(Console.yellow.darkest).toBe('\x1b[33m\x1b[2m');
    });

    it('should have dark yellow', () => {
      expect(Console.yellow.dark).toBe('\x1b[33m');
    });

    it('should have medium yellow', () => {
      expect(Console.yellow.medium).toBe('\x1b[93m\x1b[2m');
    });

    it('should have light yellow', () => {
      expect(Console.yellow.light).toBe('\x1b[93m');
    });

    it('should have lightest yellow', () => {
      expect(Console.yellow.lightest).toBe('\x1b[93m\x1b[1m');
    });

    it('should have cream yellow', () => {
      expect(Console.yellow.cream).toBe('\x1b[38;5;229m');
    });
  });

  describe('white color codes', () => {
    it('should have darkest white', () => {
      expect(Console.white.darkest).toBe('\x1b[37m\x1b[2m');
    });

    it('should have dark white', () => {
      expect(Console.white.dark).toBe('\x1b[37m');
    });

    it('should have medium white', () => {
      expect(Console.white.medium).toBe('\x1b[97m\x1b[2m');
    });

    it('should have light white', () => {
      expect(Console.white.light).toBe('\x1b[97m');
    });

    it('should have lightest white', () => {
      expect(Console.white.lightest).toBe('\x1b[97m\x1b[1m');
    });
  });

  describe('usage examples', () => {
    it('should combine color with text and reset', () => {
      const coloredText = `${Console.red.dark}Error${Console.reset}`;
      expect(coloredText).toBe('\x1b[91mError\x1b[0m');
    });

    it('should format multiple colors', () => {
      const message = `${Console.yellow.light}Warning${Console.reset} ${Console.gray.dark}message${Console.reset}`;
      expect(message).toContain('\x1b[93mWarning\x1b[0m');
      expect(message).toContain('\x1b[90mmessage\x1b[0m');
    });

    it('should have all color properties as strings', () => {
      expect(typeof Console.gray.darkest).toBe('string');
      expect(typeof Console.red.light).toBe('string');
      expect(typeof Console.yellow.medium).toBe('string');
      expect(typeof Console.white.lightest).toBe('string');
    });
  });
});
