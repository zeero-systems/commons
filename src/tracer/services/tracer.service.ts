import type { TracerInterface, TransportInterface } from '~/tracer/interfaces.ts';
import type {
  AttributesType,
  TracerOptionsType,
  TraceType,
} from '~/tracer/types.ts';

import SpanKindEnum from '~/tracer/enums/span-kind.enum.ts';
import LogLevelEnum from '~/tracer/enums/log-level.enum.ts';
import SpanStatusEnum from '~/tracer/enums/span-status.enum.ts';
import Generator from '~/tracer/services/generator.service.ts';
import QueueService from '~/common/services/queue.service.ts';

export class Tracer implements TracerInterface {
  public trace: TraceType;

  constructor(public queue: QueueService<TraceType, TransportInterface>, public options: TracerOptionsType) {
    this.trace = {
      id: options.traceId || Generator.randomId(16),
      spanId: Generator.randomId(8),
      spanParentId: options.parentId,
      name: options.name,
      kind: options.kind || SpanKindEnum.INTERNAL,
      status: SpanStatusEnum.UNSET,
      startTime: Date.now(),
      logs: [],
      events: [],
    };
  }

  public start(options: Partial<TracerOptionsType> & { name: string }): TracerInterface {
    const childTracer = new Tracer(this.queue, {
      name: options.name,
      kind: options.kind,
      traceId: options.traceId || this.trace.id,
      parentId: this.trace.spanId,
      namespaces: options.namespaces || this.options.namespaces,
      redactKeys: options.redactKeys || this.options.redactKeys,
      useWorker: options.useWorker ?? this.options.useWorker,
    });
    
    return childTracer;
  }

  public status(status: SpanStatusEnum): void {
    this.trace.status = status;
  }

  public attributes(attributes: AttributesType): void {
    this.trace.attributes = { ...this.trace.attributes, ...attributes };
  }

  public event(name: string): void {
    this.trace.events.push({
      name,
      timestamp: Date.now(),
    });
  }

  public end(): void {
    this.trace.ended = true;
    this.trace.endTime = Date.now();
    
    this.queue.enqueue(this.trace);
  }

  public flush(): void {
    if (this.queue) {
      this.queue.flush();
    }
  }

  private log(level: LogLevelEnum, message: string): void {
    this.trace.logs.push({
      level,
      message,
      timestamp: Date.now(),
    });
  }

  public info(...messages: Array<string>): void {
    for (const message of messages) {
      this.log(LogLevelEnum.INFO, message);
    }
  }

  public warn(...messages: Array<string>): void {
    for (const message of messages) {
      this.log(LogLevelEnum.WARN, message);
    }
  }

  public error(...messages: Array<string>): void {
    for (const message of messages) {
      this.log(LogLevelEnum.ERROR, message);
    }
    if (this.trace.status === SpanStatusEnum.UNSET) {
      this.trace.status = SpanStatusEnum.REJECTED;
    }
  }

  public fatal(...messages: Array<string>): void {
    for (const message of messages) {
      this.log(LogLevelEnum.FATAL, message);
    }
    this.trace.status = SpanStatusEnum.REJECTED;
  }

  public debug(...messages: Array<string>): void {
    for (const message of messages) {
      this.log(LogLevelEnum.DEBUG, message);
    }
  }

  [Symbol.dispose](): void {
    if (!this.trace.ended) {
      this.end();
    }
  }

  [Symbol.asyncDispose](): void {
    if (!this.trace.ended) {
      this.end();
    }
  }
}

export default Tracer;
