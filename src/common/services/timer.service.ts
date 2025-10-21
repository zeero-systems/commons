import type { TimeType } from '~/common/types.ts'

export class Timer {

  public timers: Map<string, TimeType> = new Map();
  
  public setTime(key: string = 'default') {
    this.timers.set(key, { key, start: performance.now(), end: 0, duration: 0 });
  }
  
  public endTime(key: string = 'default') {
    const time = this.timers.get(key);
    if (time) {
      time.end = performance.now()
      time.duration = time.end - time.start 
    }
  }

  public getTime(key: string = 'default') {
    const time = this.timers.get(key)
    this.timers.delete(key);
    return time 
  }
}

export default Timer
