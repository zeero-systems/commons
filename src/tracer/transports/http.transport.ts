import type { TransportInterface } from '~/tracer/interfaces.ts';
import type { HttpOptionsType, TraceType, TransportOptionsType } from '~/tracer/types.ts';
import LogLevelEnum from '~/tracer/enums/log-level.enum.ts';

export class HttpTransport implements TransportInterface {
  public url: string;

  constructor(url: string, public options?: TransportOptionsType & HttpOptionsType) {
    this.url = url;
  }

  public async send(data: TraceType | TraceType[]): Promise<void> {
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
            logs: trace.logs.filter(log => (this.options!.log as LogLevelEnum[]).includes(log.level))
          };
        }
      }

      try {
        const response = await fetch(this.url, {
          method: this.options?.method || 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.options?.headers || {}),
          },
          body: JSON.stringify(trace),
          signal: this.options?.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP transport failed: ${response.status}`);
        }
      } catch (error) {
        // @TODO maybe the abort signal should be handled differently
        if (error instanceof Error && error.name === 'AbortError') {
          console.warn('HTTP transport request aborted');
        } else {
          throw error;
        }
      }
    }
  }
}

export default HttpTransport;
