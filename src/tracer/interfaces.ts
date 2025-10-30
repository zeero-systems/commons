import type {
  AttributesType,
  EventType,
  LogType,
  RedactFunctionType,
  SpanOptionsType,
  SpanType,
  StartOptionsType,
  StatusType,
  TransportOptionsType
} from '~/tracer/types.ts';
import { TracerOptionsType } from '@zeero-systems/commons';

export interface TransportInterface {
  options: TransportOptionsType
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

  attributes(attributes: AttributesType): SpanInterface;
  status(status: StatusType): SpanInterface;
  event(event: EventType): SpanInterface;
  end(): void;

  async(options: StartOptionsType, callback?: (span: SpanInterface) => Promise<void>): Promise<SpanInterface>;
  child(options: StartOptionsType, callback?: (span: SpanInterface) => void): SpanInterface;
  
  [Symbol.dispose](): void;
}

export interface TracerInterface extends LogInterface {
  options: TracerOptionsType

  send(span: SpanType | LogType): Promise<void>;
  start(options: StartOptionsType, callback?: (span: SpanInterface) => void): SpanInterface
  async(options: StartOptionsType, callback?: (span: SpanInterface) => Promise<void>): Promise<SpanInterface>
  
  [Symbol.asyncDispose](): Promise<void>;
}

export default {};
