import type { TimeType } from '~/common/types.ts'
import type { TimerInterface } from '~/common/interfaces.ts';

export class Timer implements TimerInterface {

  public timers: Map<string, TimeType> = new Map();
  
  public setTime(key: string = 'default'): void {
    this.timers.set(key, { key, start: performance.now(), end: 0, duration: 0 });
  }
  
  public endTime(key: string = 'default'): void {
    const time = this.timers.get(key);
    if (time) {
      time.end = performance.now()
      time.duration = time.end - time.start 
    }
  }

  public getTime(key: string = 'default'): TimeType | undefined {
    const time = this.timers.get(key)
    this.timers.delete(key);
    return time 
  }

  [Symbol.dispose](): void {
    this.timers.clear();
  }
}

export default Timer
