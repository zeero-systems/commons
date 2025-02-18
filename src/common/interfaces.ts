import type { JsonType } from '~/common/types.ts';

export interface ExceptionInterface<K> extends Error {
  key?: K | 'EXCEPTION';
  name: string;
  message: string;
  context?: JsonType;
  stack?: string | undefined;
}

export interface ExceptionOptionsInterface extends ErrorOptions {
  context?: JsonType;
}

export interface KeyableExceptionOptionsInterface<K> extends ExceptionOptionsInterface {
  key?: K;
}

export default {};
