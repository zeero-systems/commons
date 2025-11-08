import type { SpanInterface, TracerInterface } from '~/tracer/interfaces.ts';
import type {
  AttributesType,
  LogType,
  SpanType,
  StartOptionsType,
  TracerOptionsType,
} from '~/tracer/types.ts';

import SpanEnum from '~/tracer/enums/span.enum.ts';
import LogEnum from '~/tracer/enums/log.enum.ts';
import Generator from '~/tracer/services/generator.service.ts';
import Span from '~/tracer/services/span.service.ts';

export class Tracer implements TracerInterface {
  constructor(public options: TracerOptionsType = { name: 'default', transports: [] }) { }

  public async send(data: SpanType | LogType): Promise<void> {
    let shouldSend = true;
    if (this.options.namespaces && this.options.namespaces.length > 0 && 'name' in data) {
      shouldSend = this.options.namespaces.some((ns) => data.name.startsWith(ns));
    }

    if (shouldSend) {
      queueMicrotask(() => {
        const processedRecord = this.applyRedaction(data);

        this.options.transports.forEach((transport) => {
          transport.send(processedRecord).catch((error) => {
            // @TODO maybe this should not be handled here
            // Maybe logging this error on the last transport that was successfull
            console.error('Transport error:', error);
          });
        });
      });
    }
  }

  public applyRedaction(data: SpanType | LogType): SpanType | LogType {
    const redactObject = (obj: Record<string, unknown>): Record<string, unknown> => {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = (this.options.redact || ((_k: string, v: unknown) => v))(key, value);
      }
      return result;
    };

    return {
      ...data,
      attributes: data.attributes ? redactObject(data.attributes) : undefined,
    };
  }

  public start(options: StartOptionsType, callback?: (span: SpanInterface) => void): SpanInterface {
    const span = new Span(this, {
      parentId: options?.parentId,
      traceId: options?.traceId ?? Generator.randomId(16),
      spanId: Generator.randomId(8),
      name: options.name,
      kind: options?.kind ?? SpanEnum.INTERNAL,
    });

    if (callback) {
      callback(span);
      span.end();
    }

    return span;
  }

  public async(options: StartOptionsType, callback?: (span: SpanInterface) => Promise<void>): Promise<SpanInterface> {
    const span: SpanInterface = new Span(this, {
      parentId: options?.parentId,
      traceId: options?.traceId ?? Generator.randomId(16),
      spanId: Generator.randomId(8),
      name: options.name,
      kind: options?.kind ?? SpanEnum.INTERNAL,
    });

    if (callback) {
      return callback(span).then(() => span).finally(() => span.end());
    }

    return Promise.resolve(span);
  }

  public log(level: LogEnum, message: string, attributes?: AttributesType): void {
    this.send({
      level,
      message,
      name: this.options.name,
      timestamp: Date.now(),
      attributes: attributes,
    });
  }

  debug(message: string, attributes?: AttributesType): void {
    this.log(LogEnum.DEBUG, message, attributes);
  }

  info(message: string, attributes?: AttributesType): void {
    this.log(LogEnum.INFO, message, attributes);
  }

  warn(message: string, attributes?: AttributesType): void {
    this.log(LogEnum.WARN, message, attributes);
  }

  error(message: string, attributes?: AttributesType): void {
    this.log(LogEnum.ERROR, message, attributes);
  }

  fatal(message: string, attributes?: AttributesType): void {
    this.log(LogEnum.FATAL, message, attributes);
  }

  async [Symbol.asyncDispose](): Promise<void> {
    // Allow any pending transport operations to complete
    await Promise.allSettled(
      this.options.transports.map(transport => {
        // If transport has a flush/close method, call it
        if ('flush' in transport && typeof transport.flush === 'function') {
          return transport.flush();
        }
        if ('close' in transport && typeof transport.close === 'function') {
          return transport.close();
        }
        return Promise.resolve();
      })
    );
  }
}

export default Tracer;
