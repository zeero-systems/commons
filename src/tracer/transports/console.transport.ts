import type { LogRecordType } from '~/tracer/types.ts';
import type { LogTransportInterface } from '~/tracer/interfaces.ts';

import LogEnum from '~/tracer/enums/log-level.enum.ts';

export class ConsoleTransport implements LogTransportInterface {
  constructor(public minLevel: LogEnum = LogEnum.TRACE){}
  
  public write(record: LogRecordType): Promise<void> {
    const date = new Date(record.time)
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const miliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');

    const ns = record.namespaces ? `[${record.namespaces[record.namespaces.length-1]}]` : '';
    const line = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}:${miliseconds} UTC ${LogEnum[record.level].toUpperCase()} ${ns} ${record.message}`;

    let log = console.log

    if (record.level === LogEnum.ERROR || record.level === LogEnum.FATAL) log = console.error
    if (record.level === LogEnum.WARN) log = console.warn
    if (record.level === LogEnum.INFO) log = console.info

    if (Object.keys(record.context || {}).length > 0) {
      return Promise.resolve(log(line, Object.keys(record.context || {}).length ? record.context : undefined))
    }
    return Promise.resolve(log(line))
  }

  public flush(): Promise<void> {
    if (Deno.stdout) {
      return new Promise((resolve) => {
        const encoder = new TextEncoder()
        Deno.stdout.write(encoder.encode('')).then((_err) => resolve());
      });
    }
    
    return Promise.resolve()
  }

  public close(): Promise<void> {
    return Promise.resolve();
  }
}

export default ConsoleTransport
