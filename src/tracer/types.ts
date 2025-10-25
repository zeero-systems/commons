import type { TransportInterface } from '~/tracer/interfaces.ts';

import LogEnum from '~/tracer/enums/log.enum.ts';
import SpanEnum from '~/tracer/enums/span.enum.ts';
import StatusEnum from '~/tracer/enums/status.enum.ts';

export type AttributesType = Record<string, unknown>;
export type EventType = {
  name: string;
  timestamp?: number;
  attributes?: AttributesType;
};

export type SpanType = {
  name: string;
  status: StatusType;
  message?: string;
  timestamp: number;
  startTime: number;
  endTime?: number;
  attributes?: AttributesType;
  events: EventType[];
};

export type LogType = {
  span?: SpanType;
  name: string;
  level: LogEnum;
  message: string;
  timestamp: number;
  attributes?: AttributesType;
};

export type StatusType = {
  type: StatusEnum;
  message?: string;
};

export type RedactFunctionType = (key: string, value: unknown) => unknown;

export type TracerOptionsType = {
  name: string;
  transports: Array<TransportInterface>;
  namespaces?: Array<string>;
  redact?: RedactFunctionType;
  attributes?: AttributesType;
};

export type SpanOptionsType = {
  traceId: string;
  spanId: string;
  name: string;
  kind: SpanEnum;
  parentId?: string;

  startTime: number;
  status: StatusType
  events: Array<EventType>
  ended?: boolean;
  message?: string | undefined
  endTime?: number;
  attributes?: AttributesType;

};

export type StartOptionsType = {
  name: string;
  kind?: SpanEnum;
  traceId?: string;
  parentId?: string;
};

export type TransportOptionsType = {
  log?: Array<LogEnum> | boolean;
  span?: Array<StatusEnum> | boolean;
  pretty?: boolean;
};

export type HttpOptionsType = {
  headers?: Record<string, string>;
  timeout?: number;
  signal: AbortSignal;
};

export default {};
