import type {
  AttributesType,
  TransportOptionsType,
  TracerOptionsType,
  TraceType
} from '~/tracer/types.ts';
import SpanStatusEnum from '~/tracer/enums/span-status.enum.ts';

export interface TransportInterface {
  options?: TransportOptionsType
  send(data: TraceType | TraceType[]): Promise<void>;
}

export interface TracerInterface {
  trace: TraceType
  options: TracerOptionsType

  start(options: Partial<TracerOptionsType> & { name: string }): TracerInterface;
  
  status(status: SpanStatusEnum): void;
  attributes(attributes: AttributesType): void;
  event(name: string): void;
  
  end(): void;
  flush(): void;
  
  info(...messages: Array<string>): void;
  warn(...messages: Array<string>): void;
  error(...messages: Array<string>): void;
  fatal(...messages: Array<string>): void;
  debug(...messages: Array<string>): void;
  
  [Symbol.dispose](): void;
  [Symbol.asyncDispose](): void;
}

export default {};
