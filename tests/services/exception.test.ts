import { describe, it } from 'jsr:@std/testing@^1/bdd';
import { expect } from 'jsr:@std/expect@^1';

import Exception from '~/common/services/exception.service.ts';

describe('exception', () => {
  describe('constructor', () => {
    it('should create exception with message only', () => {
      const ex = new Exception('Test error');
      
      expect(ex.message).toBe('Test error');
      expect(ex.key).toBe('ERROR');
      expect(ex.context).toBeUndefined();
      expect(ex.name).toBe('Exception');
    });

    it('should create exception with key', () => {
      const ex = new Exception<'NOT_FOUND'>('Resource not found', {
        key: 'NOT_FOUND',
      });
      
      expect(ex.message).toBe('Resource not found');
      expect(ex.key).toBe('NOT_FOUND');
    });

    it('should create exception with context', () => {
      const context = { userId: 123, action: 'delete' };
      const ex = new Exception('Failed action', { context });
      
      expect(ex.message).toBe('Failed action');
      expect(ex.context).toEqual(context);
    });

    it('should create exception with cause', () => {
      const cause = new Error('Original error');
      const ex = new Exception('Wrapped error', { cause });
      
      expect(ex.message).toBe('Wrapped error');
      expect(ex.cause).toBe(cause);
    });

    it('should create exception with all options', () => {
      const cause = new Error('Original');
      const context = { step: 'validation', field: 'email' };
      
      const ex = new Exception<'VALIDATION_ERROR'>('Validation failed', {
        key: 'VALIDATION_ERROR',
        context,
        cause,
      });
      
      expect(ex.message).toBe('Validation failed');
      expect(ex.key).toBe('VALIDATION_ERROR');
      expect(ex.context).toEqual(context);
      expect(ex.cause).toBe(cause);
    });
  });

  describe('inheritance', () => {
    it('should be instance of Error', () => {
      const ex = new Exception('Test');
      expect(ex instanceof Error).toBe(true);
    });

    it('should be throwable', () => {
      expect(() => {
        throw new Exception('Test error');
      }).toThrow('Test error');
    });

    it('should be catchable', () => {
      try {
        throw new Exception('Test error', { key: 'TEST' });
      } catch (error) {
        expect(error).toBeInstanceOf(Exception);
        expect((error as Exception<string>).key).toBe('TEST');
      }
    });

    it('should support custom exception classes', () => {
      class ValidationException extends Exception<'INVALID' | 'REQUIRED'> {}
      
      const ex = new ValidationException('Field is required', {
        key: 'REQUIRED',
      });
      
      expect(ex).toBeInstanceOf(Exception);
      expect(ex).toBeInstanceOf(ValidationException);
      expect(ex.name).toBe('ValidationException');
    });
  });

  describe('name property', () => {
    it('should set name from constructor', () => {
      const ex = new Exception('Test');
      expect(ex.name).toBe('Exception');
    });

    it('should use subclass name', () => {
      class CustomException extends Exception<'CUSTOM'> {}
      const ex = new CustomException('Test');
      expect(ex.name).toBe('CustomException');
    });
  });

  describe('typed keys', () => {
    type ErrorKeys = 'NOT_FOUND' | 'FORBIDDEN' | 'BAD_REQUEST';
    
    it('should enforce typed keys', () => {
      const ex = new Exception<ErrorKeys>('Error', { key: 'NOT_FOUND' });
      expect(ex.key).toBe('NOT_FOUND');
    });

    it('should allow ERROR as default', () => {
      const ex = new Exception<ErrorKeys>('Error');
      expect(ex.key).toBe('ERROR');
    });
  });

  describe('context usage', () => {
    it('should store request context', () => {
      const ex = new Exception('Request failed', {
        context: {
          method: 'POST',
          url: '/api/users',
          statusCode: 500,
        },
      });
      
      const ctx = ex.context as any;
      expect(ctx?.method).toBe('POST');
      expect(ctx?.url).toBe('/api/users');
      expect(ctx?.statusCode).toBe(500);
    });

    it('should store validation context', () => {
      const ex = new Exception('Validation error', {
        context: {
          field: 'email',
          value: 'invalid',
          constraints: ['must be valid email'],
        },
      });
      
      const ctx = ex.context as any;
      expect(ctx?.field).toBe('email');
      expect(ctx?.constraints).toContain('must be valid email');
    });

    it('should allow nested context objects', () => {
      const ex = new Exception('Complex error', {
        context: {
          user: { id: 1, name: 'John' },
          metadata: { timestamp: Date.now(), version: '1.0' },
        },
      });
      
      const ctx = ex.context as any;
      expect(ctx?.user).toBeDefined();
      expect(ctx?.metadata).toBeDefined();
    });
  });

  describe('real world scenarios', () => {
    it('should handle database errors', () => {
      const dbError = new Error('Connection timeout');
      const ex = new Exception<'DB_ERROR'>('Database operation failed', {
        key: 'DB_ERROR',
        cause: dbError,
        context: {
          query: 'SELECT * FROM users',
          timeout: 5000,
        },
      });
      
      expect(ex.key).toBe('DB_ERROR');
      expect(ex.cause).toBe(dbError);
      expect((ex.context as any)?.query).toBeDefined();
    });

    it('should handle API errors', () => {
      const ex = new Exception<'API_ERROR'>('External API call failed', {
        key: 'API_ERROR',
        context: {
          service: 'payment-gateway',
          endpoint: '/charge',
          httpStatus: 503,
        },
      });
      
      expect(ex.key).toBe('API_ERROR');
      expect((ex.context as any)?.httpStatus).toBe(503);
    });

    it('should handle validation chains', () => {
      const originalError = new Exception('Email invalid');
      const wrapperError = new Exception('User validation failed', {
        cause: originalError,
        context: { step: 'email-validation' },
      });
      
      expect(wrapperError.cause).toBe(originalError);
      expect((wrapperError.context as any)?.step).toBe('email-validation');
    });
  });
});
