
export interface DispatcherInterface<T>  {
  subscribe<K extends keyof T>(eventName: K, callback: (...args: T[K] extends any[] ? T[K] : [T[K]]) => void): () => void
  unsubscribe<K extends keyof T>(eventName: K, callback: (...args: T[K] extends any[] ? T[K] : [T[K]]) => void): void
  dispatch<K extends keyof T>(eventName: K, ...args: T[K] extends any[] ? T[K] : [T[K]]): Promise<void>
}

export default {}