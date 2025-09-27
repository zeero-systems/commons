import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import Dispatcher from '~/emitter/services/dispatcher.service.ts';

describe('emitter', () => {
  type Events = {
    test: { name: string }
  }

  const dispatcher = new Dispatcher<Events>() 
  const toDispatch = () => {}

  it('dispatcher subscribe', () => {
    dispatcher.subscribe('test', toDispatch)

    expect(dispatcher.listeners['test']).toHaveLength(1);
  });

  it('dispatcher unsubscribe', () => {
    dispatcher.unsubscribe('test', toDispatch)

    expect(dispatcher.listeners['test']).toHaveLength(0);
  });

  it('dispatcher dispatch', async () => {
    let hasBeenCalled = false
    dispatcher.subscribe('test', () => { hasBeenCalled = true })
    await dispatcher.dispatch('test', { name: 'test' })
    
    expect(hasBeenCalled).toEqual(true)
  })

});