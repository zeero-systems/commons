import type { TraceType, TransportOptionsType } from '~/tracer/types.ts';
import type { TransportInterface } from '~/tracer/interfaces.ts';

import LogLevelEnum from '~/tracer/enums/log-level.enum.ts';
import SpanStatusEnum from '~/tracer/enums/span-status.enum.ts';
import Console from '~/common/services/console.service.ts';

export class ConsoleTransport implements TransportInterface {
  public colors = {
    [LogLevelEnum.ERROR]: Console.red.dark,
    [LogLevelEnum.FATAL]: Console.red.medium,
    [LogLevelEnum.WARN]: Console.yellow.dark,
    [LogLevelEnum.INFO]: Console.white.light,
    [LogLevelEnum.DEBUG]: Console.gray.medium,
    [LogLevelEnum.TRACE]: Console.yellow.cream,
  };

  constructor(public options: TransportOptionsType) {}

  public send(data: TraceType | TraceType[]): Promise<void> {
    const traces = Array.isArray(data) ? data : [data];
    
    for (let trace of traces) {
      if (this.options && typeof this.options.span !== 'undefined') {
        if (this.options.span === false) {
          continue;
        }
        if (this.options.span !== true && !this.options.span.includes(trace.status)) {
          continue;
        }
      }

      if (this.options && typeof this.options.log !== 'undefined' && trace.logs.length > 0) {
        if (this.options.log === false) {
          trace = { ...trace, logs: [] };
        } else if (this.options.log !== true) {
          trace = { 
            ...trace, 
            logs: trace.logs.filter(log => (this.options.log as LogLevelEnum[]).includes(log.level))
          };
        }
      }

      // Output trace
      if (this.options.pretty) {
        this.tracePrettyPrint(trace);
      } else {
        console.log(JSON.stringify(trace));
      }
    }
    
    return Promise.resolve();
  }

  tracePrettyPrint(data: TraceType): void {
    const name = data.name.toUpperCase();
    const color = this.colors[LogLevelEnum.TRACE];
    const duration = Number(data.endTime ? data.endTime - data.startTime : 0).toFixed(3);
    const date = new Date(data.startTime);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const timestamp = `${year}/${month}/${day} ${hours}:${minutes}:${seconds} UTC`;

    let log = console.log;
    if (data.status === SpanStatusEnum.REJECTED) log = console.error;
    
    log(`${color}·  TRACE ${String(data.kind).toUpperCase()} ${name} at ${timestamp} took ${duration}ms as ${data.status}${Console.reset}`);

    let nextIndent = '└─';
    if (data.attributes || data.events.length > 0 || data.logs.length > 0) {
      nextIndent = '├─';
    }
    const parentId = data.spanParentId ? ` parentId=${data.spanParentId}` : '';
    log(`${Console.gray.medium}${nextIndent} SPAN traceId=${data.id}${parentId} spanId=${data.spanId}${Console.reset}`);
    
    if (data.attributes) {
      const attributes = Object.entries(data.attributes)
        .map(([key, value]) => `${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`)
        .join(' ');
      
      if (attributes.length > 0) {
        nextIndent = '└─';
        if (data.events.length > 0 || data.logs.length > 0) nextIndent = '├─';

        log(`${Console.gray.medium}${nextIndent} ATTRS ${attributes}${Console.reset}`);
      }
    }

    if (data.events.length > 0) {
      for (let index = 0; index < data.events.length; index++) {
        const event = data.events[index];
        const compact = Object.entries(event).map(([key, value]) => `${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`);
        
        nextIndent = '├─';
        if (index === data.events.length - 1 && data.logs.length === 0) nextIndent = '└─';

        log(`${Console.gray.medium}${nextIndent} EVENT ${compact.join(' ')}${Console.reset}`);
      }
    }

    if (data.logs.length > 0) {
      for (let index = 0; index < data.logs.length; index++) {
        const logEntry = data.logs[index];
        const logColor = this.colors[logEntry.level as keyof typeof this.colors] || Console.white.light;
        let key = LogLevelEnum[logEntry.level] || 'LOG  ';
        
        if (logEntry.level === LogLevelEnum.WARN) key = 'WARN ';
        if (logEntry.level === LogLevelEnum.INFO) key = 'INFO ';
        
        nextIndent = '├─';
        if (index === data.logs.length - 1) nextIndent = '└─';

        log(`${logColor}${nextIndent} ${key} ${logEntry.message}${Console.reset}`);
      }
    }
  }
}

export default ConsoleTransport

