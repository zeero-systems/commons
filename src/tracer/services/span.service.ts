import type { SpanInterface, TracerInterface } from '~/tracer/interfaces.ts';
import type { AttributesType, SpanOptionsType, StartOptionsType, SpanType, EventType } from '~/tracer/types.ts';

import LogEnum from '~/tracer/enums/log.enum.ts';
import StatusEnum from '~/tracer/enums/status.enum.ts';
import SpanEnum from '~/tracer/enums/span.enum.ts';
import { StatusType } from '@zeero-systems/commons';

export class Span implements SpanInterface {
  options: SpanOptionsType;

  constructor(
    public tracer: TracerInterface, 
     options: Partial<SpanOptionsType>
  ) {
    this.options = {
      name: options.name || tracer.options.name || 'default',
      traceId: options.traceId || '',
      spanId: options.spanId || '',
      kind: SpanEnum.INTERNAL,
      status: { type: StatusEnum.UNSET },
      startTime: performance.now(),
      events: [],
      ...options
    }
    if (tracer.options.attributes) {
      if (this.options.attributes) { this.options.attributes = {} }

      this.options.attributes = { ...this.options.attributes, ...tracer.options.attributes };
    }
  }

  attributes(attributes: AttributesType): SpanInterface {
    this.options.attributes = { ...this.options.attributes, ...attributes };

    return this;
  }

  status(status: StatusType): SpanInterface {
    this.options.status = status;
    this.options.message = status.message;

    if (status.type === StatusEnum.REJECTED) {
      if (!this.options.attributes) { this.options.attributes = {}; }
      this.options.attributes.error = true;
    }

    return this;
  }

  event(event: EventType): SpanInterface {
    this.options.events.push({
      name: event.name,
      timestamp: Date.now(),
      attributes: event.attributes || {},
    });

    return this;
  }

  getData(): SpanType {
    return {
      name: this.options.name,
      timestamp: Date.now(),
      startTime: this.options.startTime,
      endTime: this.options.endTime,
      attributes: {
        ...this.options.attributes,
        parentId: this.options.parentId,
        traceId: this.options.traceId,
        spanId: this.options.spanId,
        kind: this.options.kind,
      },
      events: this.options.events,
      status: this.options.status,
      message: this.options.message,
    }
  }

  end(): void {
    this.options.ended = true;
    this.options.endTime = performance.now();

    this.tracer.send(this.getData());
  }

  child(options: StartOptionsType, callback?: (span: SpanInterface) => void): SpanInterface {
    return this.tracer.start({ ...options, traceId: this.options.traceId, parentId: this.options.spanId }, callback);
  }

  async(options: StartOptionsType, callback?: (span: SpanInterface) => Promise<void>): Promise<SpanInterface> {
    return this.tracer.async({ ...options, traceId: this.options.traceId, parentId: this.options.spanId }, callback);
  }

  log(level: LogEnum, message: string, attributes?: AttributesType): void {
    const span = this.getData();

    this.tracer.send({ 
      span,
      level, 
      message,
      name: this.options.name,
      timestamp: Date.now(),
      attributes: { ...span.attributes, ...(attributes || {}) },
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
    this.status({ type: StatusEnum.REJECTED, message });
  }

  fatal(message: string, attributes?: AttributesType): void {
    this.log(LogEnum.FATAL, message, attributes);
    this.status({ type: StatusEnum.REJECTED, message });
  }
}

export default Span;
