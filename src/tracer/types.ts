import type { TransportInterface } from '~/tracer/interfaces.ts';

import LogEnum from '~/tracer/enums/log.enum.ts';
import SpanEnum from '~/tracer/enums/span.enum.ts';
import StatusEnum from '~/tracer/enums/status.enum.ts';

export type AttributesType = Record<string, unknown>;
export type EventType = {
  name: string;
  timestamp: number;
  attributes?: AttributesType;
};

export type SpanType = {
  name: string;
  status: StatusEnum;
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

export type RedactFunctionType = (key: string, value: unknown) => unknown;

export type TracerOptionsType = {
  name: string;
  level?: LogEnum;
  status?: Array<StatusEnum>;
  namespaces?: Array<string>;
  transports: Array<TransportInterface>;
  redact?: RedactFunctionType;
  attributes?: Record<string, unknown>;
}

export type SpanOptionsType = {
  traceId: string;
  spanId: string;
  name: string;
  kind: SpanEnum;
  parentId?: string;
}

export type StartOptionsType = {
  name: string,
  kind?: SpanEnum
  traceId?: string
  parentId?: string
}

export type ConsoleOptionsType = {
  pretty?: boolean;
};

export type HttpOptionsType = {
  headers?: Record<string, string>;
  timeout?: number;
  signal: AbortSignal
};

export default {}
