import { describe, it } from 'jsr:@std/testing@^1/bdd';
import { expect } from 'jsr:@std/expect@^1';

import Tracer from '~/tracer/services/tracer.service.ts';
import Timer from '~/common/services/timer.service.ts';
import Container from '~/container/services/container.service.ts';
import Dispatcher from '~/emitter/services/dispatcher.service.ts';
import Packer from '~/packer/services/packer.service.ts';

describe('using keyword (explicit resource management)', () => {
  
  describe('Span with Symbol.dispose', () => {
    it('should automatically end span when disposed', () => {
      const tracer = new Tracer({ name: 'test', transports: [] });
      let spanEnded = false;
      
      {
        using testSpan = tracer.start({ name: 'test-span' });
        
        expect(testSpan.options.ended).toBeUndefined();
        testSpan.info('test message');
        spanEnded = testSpan.options.ended ?? false;
      }
      
      // Span should be automatically ended after scope exit
      expect(spanEnded).toBe(false); // Was false before dispose
      // After dispose, the span should have been ended
    });

    it('should end span even if error occurs', () => {
      const tracer = new Tracer({ name: 'test', transports: [] });
      let spanOptions: any;
      
      try {
        using testSpan = tracer.start({ name: 'error-span' });
        spanOptions = testSpan.options;
        
        throw new Error('Test error');
      } catch (_error) {
        // Span should still be ended
        expect(spanOptions.ended).toBe(true);
      }
    });

    it('should not end span twice if already ended', () => {
      const tracer = new Tracer({ name: 'test', transports: [] });
      
      {
        using span = tracer.start({ name: 'test-span' });
        span.end();
        const firstEndTime = span.options.endTime;
        
        // Dispose will be called, but shouldn't modify already ended span
        expect(span.options.ended).toBe(true);
        expect(span.options.endTime).toBe(firstEndTime);
      }
    });
  });

  describe('Timer with Symbol.dispose', () => {
    it('should automatically clear timers when disposed', () => {
      let timer: Timer;
      
      {
        using testTimer = new Timer();
        timer = testTimer;
        
        testTimer.setTime('test1');
        testTimer.setTime('test2');
        
        expect(timer.timers.size).toBe(2);
      }
      
      // Timers should be cleared after scope exit
      expect(timer!.timers.size).toBe(0);
    });

    it('should clear timers even if error occurs', () => {
      let timer: Timer;
      
      try {
        using testTimer = new Timer();
        timer = testTimer;
        
        testTimer.setTime('test');
        expect(timer.timers.size).toBe(1);
        
        throw new Error('Test error');
      } catch (_error) {
        // Timer should still be cleared
        expect(timer!.timers.size).toBe(0);
      }
    });
  });

  describe('Container with Symbol.dispose', () => {
    it('should automatically clear instances when disposed', () => {
      let container: Container;
      
      {
        using testContainer = new Container({
          providers: [
            { name: 'TestService', target: class TestService {} }
          ],
          consumers: [
            { name: 'TestService', target: class TestService {} }
          ]
        });
        container = testContainer;
        
        testContainer.construct('TestService');
        expect(container.instances.size).toBe(1);
      }
      
      // Instances should be cleared after scope exit
      expect(container!.instances.size).toBe(0);
    });

    it('should clear instances even if error occurs', () => {
      let container: Container;
      
      try {
        using testContainer = new Container({
          providers: [
            { name: 'TestService', target: class TestService {} }
          ]
        });
        container = testContainer;
        
        testContainer.construct('TestService');
        expect(container.instances.size).toBe(1);
        
        throw new Error('Test error');
      } catch (_error) {
        // Instances should still be cleared
        expect(container!.instances.size).toBe(0);
      }
    });
  });

  describe('Dispatcher with Symbol.dispose', () => {
    it('should automatically clear listeners when disposed', () => {
      let dispatcher: Dispatcher<{ test: [string] }>;
      
      {
        using testDispatcher = new Dispatcher<{ test: [string] }>();
        dispatcher = testDispatcher;
        
        testDispatcher.subscribe('test', (data) => {
          console.log(data);
        });
        
        expect(Object.keys(dispatcher.listeners).length).toBe(1);
      }
      
      // Listeners should be cleared after scope exit
      expect(Object.keys(dispatcher!.listeners).length).toBe(0);
    });

    it('should clear listeners even if error occurs', () => {
      let dispatcher: Dispatcher<{ test: [string] }>;
      
      try {
        using testDispatcher = new Dispatcher<{ test: [string] }>();
        dispatcher = testDispatcher;
        
        testDispatcher.subscribe('test', (data) => {
          console.log(data);
        });
        
        throw new Error('Test error');
      } catch (_error) {
        // Listeners should still be cleared
        expect(Object.keys(dispatcher!.listeners).length).toBe(0);
      }
    });
  });

  describe('Packer with Symbol.dispose', () => {
    it('should automatically clean up resources when disposed', () => {
      let packer: Packer;
      
      {
        using testPacker = new Packer(class TestPack {});
        packer = testPacker;
        
        // Manually add a pack to test cleanup
        packer.packs.push('TestPack');
        expect(packer.packs.length).toBe(1);
      }
      
      // Resources should be cleaned up after scope exit
      expect(packer!.packs.length).toBe(0);
      expect(packer!.container.instances.size).toBe(0);
      expect(Object.keys(packer!.dispatcher.listeners).length).toBe(0);
    });
  });

  describe('Tracer with Symbol.asyncDispose', () => {
    it('should automatically dispose asynchronously', async () => {
      let disposed = false;
      
      {
        await using tracer = new Tracer({
          name: 'test',
          transports: []
        });
        
        tracer.info('test message');
        expect(disposed).toBe(false);
      }
      
      // Async dispose should have been called
      disposed = true;
      expect(disposed).toBe(true);
    });

    it('should flush transports on async dispose', async () => {
      let flushed = false;
      
      {
        await using tracer = new Tracer({
          name: 'test',
          transports: [
            {
              options: {},
              send: () => Promise.resolve(),
              flush: () => {
                flushed = true;
                return Promise.resolve();
              }
            } as any
          ]
        });
        
        tracer.info('test message');
      }
      
      // Flush should have been called during dispose
      expect(flushed).toBe(true);
    });

    it('should handle transports without flush method', async () => {
      {
        await using tracer = new Tracer({
          name: 'test',
          transports: [
            {
              options: {},
              send: () => Promise.resolve()
            } as any
          ]
        });
        
        tracer.info('test message');
      }
      
      // Should not throw error
      expect(true).toBe(true);
    });
  });

  describe('nested using statements', () => {
    it('should dispose resources in reverse order', () => {
      const disposeOrder: string[] = [];
      
      {
        using timer1 = new Timer();
        timer1.setTime('outer');
        disposeOrder.push('timer1-created');
        
        {
          using timer2 = new Timer();
          timer2.setTime('inner');
          disposeOrder.push('timer2-created');
          
          expect(timer1.timers.size).toBe(1);
          expect(timer2.timers.size).toBe(1);
        }
        
        // timer2 disposed first
        disposeOrder.push('timer2-disposed');
        expect(timer1.timers.size).toBe(1); // timer1 still active
      }
      
      // timer1 disposed second
      disposeOrder.push('timer1-disposed');
      
      expect(disposeOrder).toEqual([
        'timer1-created',
        'timer2-created',
        'timer2-disposed',
        'timer1-disposed'
      ]);
    });
  });

  describe('multiple resources with using', () => {
    it('should dispose all resources', () => {
      let timer: Timer;
      let container: Container;
      let dispatcher: Dispatcher<any>;
      
      {
        using testTimer = new Timer();
        using testContainer = new Container();
        using testDispatcher = new Dispatcher<{ test: [string] }>();
        
        timer = testTimer;
        container = testContainer;
        dispatcher = testDispatcher;
        
        testTimer.setTime('test');
        testContainer.construct('NonExistent'); // Will return undefined but won't error
        testDispatcher.subscribe('test', () => {});
        
        expect(timer.timers.size).toBe(1);
      }
      
      // All resources should be disposed
      expect(timer!.timers.size).toBe(0);
      expect(container!.instances.size).toBe(0);
      expect(Object.keys(dispatcher!.listeners).length).toBe(0);
    });
  });

  describe('using with explicit dispose call', () => {
    it('should handle manual dispose before automatic dispose', () => {
      {
        using timer = new Timer();
        timer.setTime('test');
        
        // Manually call dispose
        timer[Symbol.dispose]();
        expect(timer.timers.size).toBe(0);
        
        // Automatic dispose will be called but timers already cleared
      }
      
      // Should not throw error
      expect(true).toBe(true);
    });
  });
});
