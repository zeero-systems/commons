import type { DispatcherInterface } from '~/emitter/interfaces.ts';

export class Dispatcher<T> implements DispatcherInterface<T> {
  public listeners: {
    [K in keyof T]?: Array<(...args: T[K] extends any[] ? T[K] : [T[K]]) => void>;
  } = {};

  subscribe<K extends keyof T>(eventName: K, callback: (...args: T[K] extends any[] ? T[K] : [T[K]]) => void): () => void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName]?.push(callback);

    return () => this.unsubscribe(eventName, callback);
  }

  unsubscribe<K extends keyof T>(eventName: K, callback: (...args: T[K] extends any[] ? T[K] : [T[K]]) => void): void {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = this.listeners[eventName]?.filter(
        (listener) => listener !== callback
      );
    }
  }

  async dispatch<K extends keyof T>(eventName: K, ...args: T[K] extends any[] ? T[K] : [T[K]]): Promise<void> {
    if (this.listeners[eventName]) {
      for (let index = 0; index < this.listeners[eventName].length; index++) {
        await this.listeners[eventName][index](...args);
      }
    }
  }
}

export default Dispatcher
