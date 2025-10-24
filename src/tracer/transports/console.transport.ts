
import type { TransportInterface } from '~/tracer/interfaces.ts';
import type { ConsoleOptionsType, LogType, SpanType } from '~/tracer/types.ts';

import LogEnum from '~/tracer/enums/log.enum.ts';
import StatusEnum from '~/tracer/enums/status.enum.ts';

export class ConsoleTransport implements TransportInterface {
  public options: ConsoleOptionsType;

  constructor(options: ConsoleOptionsType = {}) {
    this.options = options;
  }

  public async send(data: SpanType): Promise<void> {
    if (this.options.pretty) {
      await this.prettyPrint(data);
    } else {
      console.log(JSON.stringify(data));
    }
  }
  
  prettyPrint(data: SpanType | LogType): void {
    const date = new Date(data.timestamp);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const timestamp = `${year}/${month}/${day} ${hours}:${minutes}:${seconds} UTC`;

    let log = console.log
    
    if ('level' in data) {

      if (data.level === LogEnum.ERROR || data.level === LogEnum.FATAL) log = console.error
      if (data.level === LogEnum.WARN) log = console.warn
      if (data.level === LogEnum.INFO) log = console.info
      
      const level = LogEnum[data.level];
      log(`[${data.name.toUpperCase()}][${level}] ${timestamp} - ${data.message}`);
      if (data.attributes) {
        log('  Attributes:', data.attributes);
      }
    } else {
      const duration = data.endTime ? data.endTime - data.startTime : 0;

      if (data.status === StatusEnum.REJECTED) log = console.error

      log(`[${data.name.toUpperCase()}][SPAN] (${duration}ms)`);
      log('  Attributes:', data.attributes);
      if (data.events.length > 0) {
        log('  Events:', data.events);
      }
      log('  Status:', data.status);
    }
  }
}

export default ConsoleTransport
