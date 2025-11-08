
import type { TransportInterface } from '~/tracer/interfaces.ts';
import type { LogType, SpanType, TransportOptionsType } from '~/tracer/types.ts';

import LogEnum from '~/tracer/enums/log.enum.ts';
import StatusEnum from '~/tracer/enums/status.enum.ts';
import Console from '~/common/services/console.service.ts';

export class ConsoleTransport implements TransportInterface {

  public colors = {
    [LogEnum.ERROR]: Console.red.dark,
    [LogEnum.FATAL]: Console.red.medium,
    [LogEnum.WARN]: Console.yellow.dark,
    [LogEnum.INFO]: Console.white.light,
    [LogEnum.DEBUG]: Console.gray.medium,
    [LogEnum.TRACE]: Console.yellow.cream,
  };

  constructor(public options: TransportOptionsType) {}

  public async send(data: SpanType | LogType): Promise<void> {
    const isLog = 'level' in data;
    const isSpan = 'status' in data;
    
    if (this.options) {
      if (isLog && typeof this.options.log !== 'undefined') {
          if (this.options.log === false) {
            return;
          }
          if (this.options.log !== true && !this.options.log.includes(data.level)) {
            return;
          }
      }

      if (isSpan && typeof this.options.span !== 'undefined') {
        if (this.options.span === false) {
          return;
        }
        if (this.options.span !== true && !this.options.span.includes(data.status.type)) {
          return;
        }
      }
    }

    const date = new Date(data.timestamp);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const timestamp = `${year}/${month}/${day} ${hours}:${minutes}:${seconds} UTC`;

    if (this.options.pretty) {
      if (isLog) {
        this.logPrettyPrint(timestamp, data as LogType);
      } else if (isSpan) {
        this.spanPrettyPrint(timestamp, data as SpanType);
      }
    } else {
      console.log(JSON.stringify(data));
    }
  }

  logPrettyPrint(timestamp: string, data: LogType): void {
    let log = console.log
    const name = data.name.toUpperCase()
    const color = this.colors[data.level as keyof typeof this.colors] || Console.white.light;

    let key = LogEnum[data.level] || 'LOG  '
    if (data.level === LogEnum.DEBUG) { 
      log = console.debug; 
    }
    if (data.level === LogEnum.ERROR) { 
      log = console.error; 
    }
    if (data.level === LogEnum.FATAL) { 
      log = console.error; 
    }
    if (data.level === LogEnum.WARN) { 
      key = 'WARN '
      log = console.warn; 
    }
    if (data.level === LogEnum.INFO) { 
      key = 'INFO '
      log = console.info; 
    }
    
    log(`${color}·  ${key} ${name} at ${timestamp} message ${data.message}${Console.reset}`);
    if (data.attributes) {
      const attrs = Object.entries(data.attributes)
        .map(([key, value]) => `${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`)
        .join(' ');
      log(`${Console.gray.medium}└─ ATTRS ${attrs}${Console.reset}`);
    }
  }

  spanPrettyPrint(timestamp: string, data: SpanType): void {
    let log = console.log
    const name = data.name.toUpperCase()
    const color = this.colors[LogEnum.TRACE];
    const duration = Number(data.endTime ? data.endTime - data.startTime : 0).toFixed(3);

    if (data.status.type === StatusEnum.REJECTED) log = console.error
    log(`${color}·  TRACE ${String(data.attributes?.kind).toUpperCase()} ${name} at ${timestamp} took ${duration}ms as ${data.status.type}${Console.reset}`);

    let nextIndent = '└─';
    if (data.attributes || data.events.length > 0) {
      nextIndent = '├─';
    }
    const parentId = data.attributes?.parentId ? ` parentId=${data.attributes.parentId}` : '';
    log(`${Console.gray.medium}${nextIndent} ATTRS traceId=${data.attributes?.traceId}${parentId} spanId=${data.attributes?.spanId}${Console.reset}`)
    
    const attributes = Object.entries(data.attributes || {}).filter(([key]) => key !== 'traceId' && key !== 'spanId' && key !== 'parentId')
      .map(([key, value]) => `${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`)
      .join(' ');
    
    if (attributes.length > 0) {
      nextIndent = '└─';
      if (data.events.length > 0) nextIndent = '├─';

      log(`${Console.gray.medium}${nextIndent} ATTRS ${attributes}${Console.reset}`);
    }

    if (data.events.length > 0) {
      for (let index = 0; index < data.events.length; index++) {
        const event = data.events[index];
        const compact = Object.entries(event).map(([key, value]) => `${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`)
        
        nextIndent = '├─';
        if (index === data.events.length - 1) nextIndent = '└─';

        log(`${Console.gray.medium}${nextIndent} EVENT ${compact.join(' ')}${Console.reset}`);
      }
    }
  }
}

export default ConsoleTransport
