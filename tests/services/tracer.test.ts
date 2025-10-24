import { describe, it, beforeAll, afterAll, beforeEach, afterEach } from "@std/bdd";
import { expect } from "@std/expect";
import { Tracer } from '~/tracer/services/tracer.service.ts';
import ConsoleTransport from '~/tracer/transports/console.transport.ts'
import HttpTransport from '~/tracer/transports/http.transport.ts'
import type { SpanType, LogType } from '~/tracer/types.ts';
import LogEnum from '~/tracer/enums/log.enum.ts';
import SpanEnum from '~/tracer/enums/span.enum.ts';
import StatusEnum from '~/tracer/enums/status.enum.ts';

class MockHttpTransport extends HttpTransport {
  public sentData: Array<SpanType | LogType> = [];
  public callCount = 0;

  constructor() {
    const controller = new AbortController();
    super('https://example.com/v1/traces', {
      headers: {
        'Authorization': 'Bearer mock-token',
        'X-Service-Name': 'test-service',
      },
      signal: controller.signal,
    });
  }

  override async send(data: SpanType | LogType): Promise<void> {
    this.sentData.push(data);
    this.callCount++;
    return Promise.resolve();
  }

  reset() {
    this.sentData = [];
    this.callCount = 0;
  }
}

class MockConsoleTransport extends ConsoleTransport {
  public logs: string[] = [];
  public callCount = 0;

  constructor() {
    super({ pretty: false });
  }

  override async send(data: SpanType | LogType): Promise<void> {
    this.logs.push(JSON.stringify({ ...data, tracker: undefined }));
    this.callCount++;
    return Promise.resolve();
  }

  reset() {
    this.logs = [];
    this.callCount = 0;
  }
}

describe('Tracer with Console and HTTP Transports', () => {
  let mockHttpTransport: MockHttpTransport;
  let mockConsoleTransport: MockConsoleTransport;
  let tracer: Tracer;

  beforeEach(() => {
    mockHttpTransport = new MockHttpTransport();
    mockConsoleTransport = new MockConsoleTransport();
    
    tracer = new Tracer({
      level: LogEnum.DEBUG,
      transports: [mockHttpTransport, mockConsoleTransport],
      attributes: {
        service: 'test-service',
        version: '1.0.0',
        environment: 'test',
        user: 'zeeromabs',
      },
    });
  });

  afterEach(() => {
    mockHttpTransport.reset();
    mockConsoleTransport.reset();
  });

  describe('Basic Tracer Functionality', () => {
    it('should create a tracer with correct options', () => {
      expect(tracer.level).toBe(LogEnum.DEBUG);
      expect(tracer.transports.length).toBe(2);
      expect(tracer.attributes?.service).toBe('test-service');
      expect(tracer.attributes?.user).toBe('zeeromabs');
    });

    it('should log messages at tracer level', () => {
      tracer.info('Test message', { key: 'value' });

      expect(mockHttpTransport.callCount).toBe(1);
      expect(mockConsoleTransport.callCount).toBe(1);

      const sentData = mockHttpTransport.sentData[0] as LogType
      expect(sentData.level).toBe(LogEnum.INFO);
      expect(sentData.message).toBe('Test message');
      expect(sentData.attributes?.key).toBe('value');
    });

    it('should respect log level threshold', () => {
      const warnTracer = new Tracer({
        level: LogEnum.WARN,
        transports: [mockHttpTransport],
      });

      warnTracer.debug('Debug message');
      warnTracer.info('Info message');
      warnTracer.warn('Warn message');

      expect(mockHttpTransport.callCount).toBe(1);
      const sentData = mockHttpTransport.sentData[0] as unknown as LogType;
      expect(sentData.level).toBe(LogEnum.WARN);
    });

    it('should send logs to both HTTP and Console transports', () => {
      tracer.error('Error occurred', { errorCode: 500 });

      expect(mockHttpTransport.callCount).toBe(1);
      expect(mockConsoleTransport.callCount).toBe(1);

      const httpData = mockHttpTransport.sentData[0];
      expect(httpData.message).toBe('Error occurred');
      expect(httpData.attributes?.errorCode).toBe(500);

      const consoleData = JSON.parse(mockConsoleTransport.logs[0]);
      expect(consoleData.message).toBe('Error occurred');
    });
  });

  describe('Single Span Operations', () => {
    it('should create and end a span', async () => {
      const span = await tracer.start({ name: 'test-operation', kind: SpanEnum.SERVER });
      
      expect(span.options.name).toBe('test-operation');
      expect(span.options.kind).toBe(SpanEnum.SERVER);
      expect(span.options.traceId).toBeTruthy();
      expect(span.options.spanId).toBeTruthy();


      span.end();

      expect(mockHttpTransport.callCount).toBe(1);
      expect(mockConsoleTransport.callCount).toBe(1);

      const sentData = mockHttpTransport.sentData[0] as SpanType;
      expect(sentData.name).toBe('test-operation');
      expect(sentData.startTime).toBeTruthy();
      expect(sentData.endTime).toBeTruthy();
    });

    it('should set attributes on a span', async () => {
      const span = await tracer.start({ name: 'attribute-test' });
      
      span.setAttributes({
        userId: 'user-123',
        requestId: 'req-456',
        timestamp: new Date().toISOString(),
      });

      span.end();

      const sentData = mockHttpTransport.sentData[0] as SpanType;
      expect(sentData.attributes.userId).toBe('user-123');
      expect(sentData.attributes.requestId).toBe('req-456');
      expect(sentData.attributes.timestamp).toBeTruthy();
    });

    it('should add events to a span', async () => {
      const span = await tracer.start({ name: 'event-test' });
      
      span.addEvent('validation-start');
      span.addEvent('validation-complete', { valid: true, duration: 50 });
      span.addEvent('processing-complete');

      span.end();

      const sentData = mockHttpTransport.sentData[0] as SpanType;
      expect(sentData.events.length).toBe(3);
      expect(sentData.events[0].name).toBe('validation-start');
      expect(sentData.events[1].name).toBe('validation-complete');
      expect(sentData.events[1].attributes?.valid).toBe(true);
      expect(sentData.events[2].name).toBe('processing-complete');
    });

    it('should set span status', async () => {
      const span = await tracer.start({ name: 'status-test' });
      
      span.setStatus(StatusEnum.RESOLVED, 'Operation completed successfully');
      span.end();

      const sentData = mockHttpTransport.sentData[0] as SpanType;
      expect(sentData.message).toBe('Operation completed successfully');
    });

    it('should handle span errors', async () => {
      const span = await tracer.start({ name: 'error-test' });
      
      span.error('Something went wrong', { errorCode: 'ERR_001' });
      span.end();

      expect(mockHttpTransport.callCount).toBe(2);

      const logData = mockHttpTransport.sentData[0] as unknown as LogType;
      expect(logData.level).toBe(LogEnum.ERROR);
      expect(logData.message).toBe('Something went wrong');

      const spanData = mockHttpTransport.sentData[1] as SpanType;
      expect(spanData.attributes.error).toBe(true);
    });
  });

  describe('Nested Spans - Two Levels', () => {
    it('should create parent and child spans', async () => {
      const parent = await tracer.start({ name: 'parent-operation', kind: SpanEnum.SERVER });
      parent.setAttributes({ parentAttr: 'parent-value' });

      const child = await parent.child({ name: 'child-operation', kind: SpanEnum.CLIENT });
      child.setAttributes({ childAttr: 'child-value' });

      child.end();
      parent.end();

      expect(mockHttpTransport.callCount).toBe(2);

      const childData = mockHttpTransport.sentData[0] as SpanType;
      const parentData = mockHttpTransport.sentData[1] as SpanType;

      expect(childData.name).toBe('child-operation');
      expect(childData.attributes.parentId).toBe(parent.options.spanId);
      expect(childData.attributes.traceId).toBe(parent.options.traceId);

      expect(parentData.name).toBe('parent-operation');
      expect(parentData.attributes.spanId).toBe(parent.options.spanId);
    });

    it('should maintain trace context across parent-child', async () => {
      const traceId = 'custom-trace-123';
      const parent = await tracer.start({ name: 'parent', traceId, kind: SpanEnum.SERVER });
      const child = await parent.child({ name: 'child', kind: SpanEnum.INTERNAL });

      child.end();
      parent.end();

      const childData = mockHttpTransport.sentData[0] as SpanType;
      const parentData = mockHttpTransport.sentData[1] as SpanType;

      expect(childData.attributes.traceId).toBe(traceId);
      expect(parentData.attributes.traceId).toBe(traceId);
      expect(childData.attributes.parentId).toBe(parent.options.spanId);
    });

    it('should log within span context', async () => {
      const parent = await tracer.start({ name: 'parent-with-logs' });
      parent.info('Parent started');

      const child = await parent.child({ name: 'child-with-logs' });
      child.debug('Child processing', { step: 1 });
      child.info('Child completed', { step: 2 });

      child.end();
      parent.end();

      expect(mockHttpTransport.callCount).toBe(5);

      const parentLog = mockHttpTransport.sentData[0] as unknown as LogType;
      expect(parentLog.message).toBe('Parent started');
      expect(parentLog.attributes?.spanId).toBe(parent.options.spanId);

      const childLog1 = mockHttpTransport.sentData[1] as unknown as LogType;
      expect(childLog1.message).toBe('Child processing');
      expect(childLog1.attributes?.spanId).toBe(child.options.spanId);
    });
  });

  describe('Nested Spans - Three Levels', () => {
    it('should create three levels of nested spans', async () => {
      const level1 = await tracer.start({ name: 'level1-api-request', kind: SpanEnum.SERVER });
      level1.setAttributes({ endpoint: '/api/users', method: 'GET' });

      const level2 = await level1.child({ name: 'level2-business-logic', kind: SpanEnum.INTERNAL });
      level2.setAttributes({ operation: 'validate-user' });

      const level3 = await level2.child({ name: 'level3-database-query', kind: SpanEnum.CLIENT });
      level3.setAttributes({ query: 'SELECT * FROM users', db: 'postgres' });

      level3.end();
      level2.end();
      level1.end();

      expect(mockHttpTransport.callCount).toBe(3);

      const level3Data = mockHttpTransport.sentData[0] as SpanType;
      const level2Data = mockHttpTransport.sentData[1] as SpanType;
      const level1Data = mockHttpTransport.sentData[2] as SpanType;

      expect(level3Data.attributes.traceId).toBe(level1Data.attributes.traceId);
      expect(level2Data.attributes.traceId).toBe(level1Data.attributes.traceId);

      expect(level3Data.attributes.parentId).toBe(level2.options.spanId);
      expect(level2Data.attributes.parentId).toBe(level1.options.spanId);
      expect(level1Data.attributes.parentId).toBeUndefined();
    });

    it('should handle errors at different nesting levels', async () => {
      const level1 = await tracer.start({ name: 'level1' });
      level1.info('Level 1 started');

      const level2 = await level1.child({ name: 'level2' });
      level2.info('Level 2 started');

      const level3 = await level2.child({ name: 'level3' });
      level3.error('Level 3 encountered an error', { errorType: 'DatabaseError' });
      level3.end();

      level2.warn('Level 2 completed with warnings');
      level2.end();

      level1.end();

      expect(mockHttpTransport.callCount).toBe(7);

      const level3ErrorLog = mockHttpTransport.sentData.find(
        d => 'level' in d && d.level === LogEnum.ERROR
      );
      expect(level3ErrorLog?.message).toBe('Level 3 encountered an error');
      expect(level3ErrorLog?.attributes?.errorType).toBe('DatabaseError');
    });
  });

  describe('Multiple Child Spans', () => {
    it('should create multiple children from same parent', async () => {
      const parent = await tracer.start({ name: 'parent-with-multiple-children' });

      const child1 = await parent.child({ name: 'child1', kind: SpanEnum.CLIENT });
      child1.setAttributes({ childId: 1 });
      child1.end();

      const child2 = await parent.child({ name: 'child2', kind: SpanEnum.CLIENT });
      child2.setAttributes({ childId: 2 });
      child2.end();

      const child3 = await parent.child({ name: 'child3', kind: SpanEnum.CLIENT });
      child3.setAttributes({ childId: 3 });
      child3.end();

      parent.end();

      expect(mockHttpTransport.callCount).toBe(4);

      const child1Data = mockHttpTransport.sentData[0] as SpanType;
      const child2Data = mockHttpTransport.sentData[1] as SpanType;
      const child3Data = mockHttpTransport.sentData[2] as SpanType;

      expect(child1Data.attributes.parentId).toBe(parent.options.spanId);
      expect(child2Data.attributes.parentId).toBe(parent.options.spanId);
      expect(child3Data.attributes.parentId).toBe(parent.options.spanId);

      expect(child1Data.attributes.childId).toBe(1);
      expect(child2Data.attributes.childId).toBe(2);
      expect(child3Data.attributes.childId).toBe(3);
    });

    it('should handle sibling spans with different kinds', async () => {
      const parent = await tracer.start({ name: 'parent', kind: SpanEnum.SERVER });

      const dbSpan = await parent.child({ name: 'database-query', kind: SpanEnum.CLIENT });
      dbSpan.setAttributes({ db: 'postgresql', operation: 'SELECT' });
      dbSpan.end();

      const cacheSpan = await parent.child({ name: 'cache-lookup', kind: SpanEnum.CLIENT });
      cacheSpan.setAttributes({ cache: 'redis', key: 'user:123' });
      cacheSpan.end();

      const queueSpan = await parent.child({ name: 'queue-publish', kind: SpanEnum.PRODUCER });
      queueSpan.setAttributes({ queue: 'notifications', messageId: 'msg-456' });
      queueSpan.end();

      parent.end();

      expect(mockHttpTransport.callCount).toBe(4);

      const dbData = mockHttpTransport.sentData[0] as SpanType;
      const cacheData = mockHttpTransport.sentData[1] as SpanType;
      const queueData = mockHttpTransport.sentData[2] as SpanType;

      expect(dbData.attributes.kind).toBe(SpanEnum.CLIENT);
      expect(cacheData.attributes.kind).toBe(SpanEnum.CLIENT);
      expect(queueData.attributes.kind).toBe(SpanEnum.PRODUCER);
    });
  });

  describe('Complex Real-World Scenario', () => {
    it('should trace a complete order processing workflow', async () => {
      const requestSpan = await tracer.start({ name: 'http.request', kind: SpanEnum.SERVER, traceId: 'trace-order-12345' });

      requestSpan.setAttributes({
        'http.method': 'POST',
        'http.route': '/api/orders',
        'http.status_code': 200,
        'user.id': 'zeeromabs',
        'request.timestamp': '2025-10-24 15:03:23',
      });

      requestSpan.info('Received order request');

      const validateSpan = await requestSpan.child({ name: 'order.validate', kind: SpanEnum.INTERNAL });
      validateSpan.debug('Validating order data');
      validateSpan.addEvent('validation.started');
      await new Promise(resolve => setTimeout(resolve, 10));
      validateSpan.addEvent('validation.completed', { valid: true });
      validateSpan.setStatus(StatusEnum.RESOLVED);
      validateSpan.end();

      const inventorySpan = await requestSpan.child({ name: 'inventory.check', kind: SpanEnum.CLIENT });
      inventorySpan.setAttributes({
        'inventory.sku': 'ITEM-001',
        'inventory.quantity': 5,
      });
      inventorySpan.info('Checking inventory');
      await new Promise(resolve => setTimeout(resolve, 20));

      const inventoryDbSpan = await inventorySpan.child({ name: 'inventory.database.query', kind: SpanEnum.CLIENT });
      inventoryDbSpan.setAttributes({
        'db.system': 'postgresql',
        'db.statement': 'SELECT quantity FROM inventory WHERE sku = $1',
      });
      await new Promise(resolve => setTimeout(resolve, 15));
      inventoryDbSpan.addEvent('query.complete', { rowCount: 1 });
      inventoryDbSpan.end();

      inventorySpan.addEvent('inventory.available', { inStock: true });
      inventorySpan.end();

      const paymentSpan = await requestSpan.child({ name: 'payment.process', kind: SpanEnum.CLIENT });
      paymentSpan.setAttributes({
        'payment.provider': 'stripe',
        'payment.amount': 99.99,
        'payment.currency': 'USD',
      });
      paymentSpan.info('Processing payment');
      await new Promise(resolve => setTimeout(resolve, 30));
      paymentSpan.addEvent('payment.authorized', {
        transactionId: 'txn_123456789',
        authCode: 'AUTH_OK',
      });
      paymentSpan.setStatus(StatusEnum.RESOLVED);
      paymentSpan.end();

      const createOrderSpan = await requestSpan.child({ name: 'order.create', kind: SpanEnum.CLIENT });
      createOrderSpan.setAttributes({
        'db.system': 'postgresql',
        'db.operation': 'INSERT',
        'order.id': 'ORD-12345',
      });
      await new Promise(resolve => setTimeout(resolve, 25));
      createOrderSpan.addEvent('order.created', { orderId: 'ORD-12345' });
      createOrderSpan.end();

      const notificationSpan = await requestSpan.child({ name: 'notification.send', kind: SpanEnum.PRODUCER });
      notificationSpan.setAttributes({
        'messaging.system': 'rabbitmq',
        'messaging.destination': 'order.notifications',
        'notification.type': 'order_confirmation',
      });
      await new Promise(resolve => setTimeout(resolve, 10));
      notificationSpan.addEvent('message.published', { messageId: 'msg_789' });
      notificationSpan.end();

      requestSpan.info('Order processed successfully', {
        orderId: 'ORD-12345',
        totalAmount: 99.99,
      });
      requestSpan.setStatus(StatusEnum.RESOLVED, 'Order completed');
      requestSpan.end();

      expect(mockHttpTransport.callCount).toBe(12);

      const spanData = mockHttpTransport.sentData.filter(d => 'startTime' in d) as SpanType[];
      const allTraceIds = spanData.map(s => s.attributes.traceId);
      const uniqueTraceIds = new Set(allTraceIds);
      expect(uniqueTraceIds.size).toBe(1);
      expect(uniqueTraceIds.has('trace-order-12345')).toBe(true);

      const requestData = spanData.find(s => s.name === 'http.request');
      const inventoryData = spanData.find(s => s.name === 'inventory.check');
      const inventoryDbData = spanData.find(s => s.name === 'inventory.database.query');

      expect(inventoryData?.attributes.parentId).toBe(requestData?.attributes.spanId);
      expect(inventoryDbData?.attributes.parentId).toBe(inventorySpan.options.spanId);
    });
  });

  describe('Namespace Filtering', () => {
    it('should filter spans by namespace', async () => {
      const filteredTracer = new Tracer({
        level: LogEnum.INFO,
        namespaces: ['api'],
        transports: [mockHttpTransport]
      });

      const apiSpan = await filteredTracer.start({ name: 'api.getUser' });
      apiSpan.end();

      const internalSpan = await filteredTracer.start({ name: 'internal.cache' });
      internalSpan.end();

      expect(mockHttpTransport.callCount).toBe(1);
      const sentData = mockHttpTransport.sentData[0] as SpanType;
      expect(sentData.name).toBe('api.getUser');
    });
  });

  describe('Redaction', () => {
    it('should redact sensitive data', () => {
      const redactingTracer = new Tracer({
        level: LogEnum.INFO,
        transports: [mockHttpTransport],
        redact: (key: string, value: unknown) => {
          if (key.toLowerCase().includes('password') || key.toLowerCase().includes('token')) {
            return '***REDACTED***';
          }
          return value;
        },
      });

      redactingTracer.info('User login', {
        username: 'zeeromabs',
        password: 'secret123',
        apiToken: 'token-abc-xyz',
        email: 'user@example.com',
      });

      const logData = mockHttpTransport.sentData[0];
      expect(logData.attributes?.username).toBe('zeeromabs');
      expect(logData.attributes?.password).toBe('***REDACTED***');
      expect(logData.attributes?.apiToken).toBe('***REDACTED***');
      expect(logData.attributes?.email).toBe('user@example.com');
    });
  });

  describe('Error Scenarios', () => {
    it('should handle missing attributes gracefully', async () => {
      const span = await tracer.start({ name: 'no-attributes-test' });
      span.end();

      const sentData = mockHttpTransport.sentData[0] as SpanType;
      expect(sentData.attributes).toBeTruthy();
      expect(sentData.events).toEqual([]);
    });
  });
});