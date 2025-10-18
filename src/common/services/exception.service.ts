import type { ExceptionInterface, KeyableExceptionOptionsInterface } from '~/common/interfaces.ts';
import type { JsonType } from '~/common/types.ts';

/**
 * A base implementation of the ExceptionInterface
 * 
 * @implements {ExceptionInterface<K>}
 * 
 * @constructor
 * @param {string} message - Required message
 * @param {KeyableExceptionOptionsInterface<K>} options - Adds extra options to the exception
 */ 
export class Exception<K> extends Error implements ExceptionInterface<K> {
  key?: K | 'ERROR';
  context?: JsonType;

  constructor(message: string, options?: KeyableExceptionOptionsInterface<K>) {
    super(message, { cause: options?.cause });
    this.key = options?.key || 'ERROR';
    this.context = options?.context;
    this.name = this.constructor.name;
  }
}

export default Exception;
