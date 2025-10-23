import type { LogTransportInterface } from '~/tracer/interfaces.ts';

import LogLevelEnum from '~/tracer/enums/log-level.enum.ts';

export type LogRecordType = {
  level: LogLevelEnum;
  message: string;
  time: number;
  namespaces?: Array<string>
  context?: Record<string, unknown>
}

export type TracerOptionsType = {
  level: LogLevelEnum;
  transports: Array<LogTransportInterface>;
  namespaces?: Array<string>
  redact?: (key: string, value: unknown) => unknown;
  context?: Record<string, unknown>;
}

export default {}
