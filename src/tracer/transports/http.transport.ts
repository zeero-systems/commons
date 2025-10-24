import { TransportInterface } from '~/tracer/interfaces.ts';
import { HttpOptionsType, SpanType } from '~/tracer/types.ts';

export class HttpTransport implements TransportInterface {
  public url: string;
  public options: HttpOptionsType;

  constructor(url: string, options: HttpOptionsType) {
    this.url = url;
    this.options = options;
  }

  async send(data: SpanType): Promise<void> {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.options.headers,
        },
        body: JSON.stringify(data),
        signal: this.options.signal,
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
