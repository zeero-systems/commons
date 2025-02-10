import type { JsonType } from "~/common/types.ts"

export interface ExceptionInterface<T> extends Error {
  key?: T | 'EXCEPTION'
  name: string
  message: string
  context?: JsonType
  stack?: string | undefined
}

export interface ExceptionOptionsInterface extends ErrorOptions {
  context?: JsonType
}

export interface KeyableExceptionOptionsInterface<T> extends ExceptionOptionsInterface {
  key?: T
}