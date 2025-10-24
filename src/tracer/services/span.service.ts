import type { SpanInterface, TracerInterface } from '~/tracer/interfaces.ts';
import type { AttributesType, EventType, SpanOptionsType, StartOptionsType, SpanType } from '~/tracer/types.ts';

import LogEnum from '~/tracer/enums/log.enum.ts';
import StatusEnum from '~/tracer/enums/status.enum.ts';

export class Span implements SpanInterface {
  public options: SpanOptionsType;
  public tracer: TracerInterface;
  public startTime: number;
  public endTime?: number;
  public attributes: AttributesType;
  public ended: boolean = false;
  public events: Array<EventType> = [];
  public status: StatusEnum = StatusEnum.UNSET;
  public message: string | undefined = undefined;

  constructor(tracer: TracerInterface, options: SpanOptionsType) {
    this.tracer = tracer;
    this.options = options;
    this.startTime = Date.now();
    this.attributes = { ...tracer.attributes };
  }

  setAttributes(attributes: AttributesType): SpanInterface {
    this.attributes = { ...this.attributes, ...attributes };

    return this;
  }

  setStatus(status: StatusEnum, message?: string): SpanInterface {
    this.status = status;
    this.message = message;

    if (status === StatusEnum.REJECTED) {
      this.attributes.error = true;
    }

    return this;
  }

  addEvent(name: string, attributes?: AttributesType): SpanInterface {
    this.events.push({
      name,
      timestamp: Date.now(),
      attributes: attributes || {},
    });

    return this;
  }

  getData(): SpanType {
    return {
      name: this.options.name,
      timestamp: Date.now(),
      startTime: this.startTime,
      endTime: this.endTime,
      attributes: {
        ...this.attributes,
        parentId: this.options.parentId,
        traceId: this.options.traceId,
        spanId: this.options.spanId,
        kind: this.options.kind,
      },
      events: this.events,
      status: this.status,
      message: this.message,
    }
  }

  end(): void {
    this.ended = true;
    this.endTime = Date.now();

    this.tracer.send(this.getData());
  }

  child(options: StartOptionsType, callback?: (span: SpanInterface) => Promise<void>): Promise<SpanInterface> {
    return this.tracer.start({ ...options, traceId: this.options.traceId, parentId: this.options.spanId }, callback);
  }

  log(level: LogEnum, message: string, attributes?: AttributesType): void {
    if (level < this.tracer.level) {
      return;
    }

    const span = this.getData();

    this.tracer.send({ 
      span,
      level, 
      message,
      name: this.options.name,
      timestamp: Date.now(),
      attributes: { ...span.attributes, ...attributes },
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
    this.setStatus(StatusEnum.REJECTED, message);
  }

  fatal(message: string, attributes?: AttributesType): void {
    this.log(LogEnum.FATAL, message, attributes);
    this.setStatus(StatusEnum.REJECTED, message);
  }
}

export default Span;
