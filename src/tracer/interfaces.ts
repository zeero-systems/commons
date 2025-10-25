import type {
  AttributesType,
  LogType,
  RedactFunctionType,
  SpanOptionsType,
  SpanType,
  StartOptionsType,
} from '~/tracer/types.ts';

import StatusEnum from '~/tracer/enums/status.enum.ts';
import LogEnum from '~/tracer/enums/log.enum.ts';

export interface TransportInterface {
  send(data: SpanType | LogType): Promise<void>;
}

export interface LogInterface {
  debug(message: string, attributes?: AttributesType): void;
  info(message: string, attributes?: AttributesType): void;
  warn(message: string, attributes?: AttributesType): void;
  error(message: string, attributes?: AttributesType): void;
  fatal(message: string, attributes?: AttributesType): void;
}

export interface SpanInterface extends LogInterface {
  options: SpanOptionsType;

  setAttributes(attributes: AttributesType): SpanInterface;
  setStatus(status: StatusEnum, message?: string): SpanInterface;
  addEvent(name: string, attributes?: AttributesType): SpanInterface;
  end(): void;

  child(options: StartOptionsType, callback?: (span: SpanInterface) => Promise<void>): Promise<SpanInterface>;
}

export interface TracerInterface extends LogInterface {
  level: LogEnum;
  redact: RedactFunctionType;
  namespaces: Array<string>;
  transports: Array<TransportInterface>;
  attributes: Record<string, unknown> | null;

  send(span: SpanType | LogType): void;
  start(options: StartOptionsType, callback?: (span: SpanInterface) => Promise<void>): Promise<SpanInterface>;
}

export default {};
