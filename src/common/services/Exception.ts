import type { ExceptionInterface, KeyableExceptionOptionsInterface } from '~/common/interfaces.ts';
import type { JsonType } from '~/common/types.ts';

export class Exception<K> extends Error implements ExceptionInterface<K> {
  key?: K | 'EXCEPTION';
  context?: JsonType;

  constructor(message: string, options?: KeyableExceptionOptionsInterface<K>) {
    super(message, { cause: options?.cause });
    this.key = options?.key || 'EXCEPTION';
    this.context = options?.context;
    this.name = this.constructor.name;
  }
}

export default Exception;
