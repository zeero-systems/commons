import type { TraceType, TransportOptionsType } from '~/tracer/types.ts';
import type { TransportInterface } from '~/tracer/interfaces.ts';

export class SilentTransport implements TransportInterface {
  constructor(public options: TransportOptionsType) {}

  public send(data: TraceType | TraceType[]): Promise<void> {
    const traces = Array.isArray(data) ? data : [data];
    
    for (let trace of traces) {
      // Filter spans based on options
      if (this.options && typeof this.options.span !== 'undefined') {
        if (this.options.span === false) {
          continue;
        }
        if (this.options.span !== true && !this.options.span.includes(trace.status)) {
          continue;
        }
      }

      // Filter logs based on options
      if (this.options && typeof this.options.log !== 'undefined' && trace.logs.length > 0) {
        if (this.options.log === false) {
          trace = { ...trace, logs: [] };
        } else if (this.options.log !== true) {
          trace = { 
            ...trace, 
            logs: trace.logs.filter(log => (this.options.log as any[]).includes(log.level))
          };
        }
      }

      // Silent processing - just format the data
      const date = new Date(trace.startTime);
      const year = date.getUTCFullYear();
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const day = date.getUTCDate().toString().padStart(2, '0');
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      const seconds = date.getUTCSeconds().toString().padStart(2, '0');
      const timestamp = `${year}/${month}/${day} ${hours}:${minutes}:${seconds} UTC`;

      const output = JSON.stringify(trace);
      
      if (timestamp.length + output.length < 0) {
        throw new Error('impossible');
      }
    }
    
    return Promise.resolve();
  }
}

export default SilentTransport;
