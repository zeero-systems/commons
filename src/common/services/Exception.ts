import type { ExceptionInterface, KeyableExceptionOptionsInterface } from '~/common/interfaces.ts';
import type { JsonType } from '~/common/types.ts';

export class Exception<T> extends Error implements ExceptionInterface<T> {
  key?: T | 'EXCEPTION'
  context?: JsonType

  constructor(message: string, options?: KeyableExceptionOptionsInterface<T>) {
    super(message, { cause: options?.cause })
    this.key = options?.key || 'EXCEPTION'
    this.context = options?.context
    this.name = this.constructor.name
  }
  
}

export default Exception