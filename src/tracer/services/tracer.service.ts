import type { SpanInterface, TracerInterface, TransportInterface } from '~/tracer/interfaces.ts';
import type {
  AttributesType,
  LogType,
  RedactFunctionType,
  SpanType,
  StartOptionsType,
  TracerOptionsType,
} from '~/tracer/types.ts';

import SpanEnum from '~/tracer/enums/span.enum.ts';
import LogEnum from '~/tracer/enums/log.enum.ts';
import Generator from '~/tracer/services/generator.service.ts';
import Span from '~/tracer/services/span.service.ts';

export class Tracer implements TracerInterface {
  name: string;
  level: LogEnum;
  namespaces: Array<string>;
  transports: Array<TransportInterface>;
  redact: RedactFunctionType;
  attributes: Record<string, unknown>;

  constructor(options: Partial<TracerOptionsType> = {}) {
    this.name = options.name || 'tracer';
    this.level = options.level ?? LogEnum.INFO;
    this.redact = options.redact ?? ((_k: string, v: unknown) => v);
    this.transports = options.transports ?? [];
    this.attributes = options.attributes ?? {};
    this.namespaces = options.namespaces ?? [];
  }

  public send(data: SpanType | LogType): void {
    let shouldSend = true;
    if (this.namespaces.length > 0 && 'name' in data) {
      shouldSend = this.namespaces.some((ns) => data.name.startsWith(ns));
    }

    if (shouldSend) {
      const processedRecord = this.applyRedaction(data);

      this.transports.forEach((transport) => {
        transport.send(processedRecord).catch((error) => {
          // @TODO maybe this should not be handled here
          // Maybe logging this error on the last transport that was successfull
          console.error('Transport error:', error);
        });
      });
    }
  }

  public applyRedaction(data: SpanType | LogType): SpanType | LogType {
    const redactObject = (obj: Record<string, unknown>): Record<string, unknown> => {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.redact(key, value);
      }
      return result;
    };

    return {
      ...data,
      attributes: redactObject(data.attributes),
    };
  }

  public start(options: StartOptionsType, callback?: (span: SpanInterface) => Promise<void>): Promise<SpanInterface> {
    const span = new Span(this, {
      parentId: options?.parentId,
      traceId: options?.traceId ?? Generator.randomId(16),
      spanId: Generator.randomId(8),
      name: options.name,
      kind: options?.kind ?? SpanEnum.INTERNAL,
    });

    if (callback) {
      return callback(span).then(() => span).finally(() => {
        span.end();
      });
    }

    return Promise.resolve(span);
  }

  public log(level: LogEnum, message: string, attributes?: AttributesType): void {
    if (level < this.level) {
      return;
    }

    this.send({
      level,
      message,
      name: this.name,
      timestamp: Date.now(),
      attributes: attributes || {},
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
}

export default Tracer;
