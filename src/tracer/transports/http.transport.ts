import { TransportInterface } from '~/tracer/interfaces.ts';
import { HttpOptionsType, LogType, SpanType, TransportOptionsType } from '~/tracer/types.ts';

export class HttpTransport implements TransportInterface {
  public url: string;

  constructor(url: string, public options?: TransportOptionsType & HttpOptionsType) {
    this.url = url;
    this.options = options;
  }

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

    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.options?.headers || {},
        },
        body: JSON.stringify(data),
        signal: this.options?.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP transport failed: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('HTTP transport request aborted');
      } else {
        throw error;
      }
    }
  }
}

export default HttpTransport;
