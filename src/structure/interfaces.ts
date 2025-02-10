
export interface ConstructorInterface<T> {
  new (...args: any[]): T;
}

export interface ArrayMapInterface<K, A> extends MapConstructor {
  new (): this
  add(key: K, value: A): this
  removeByIndex(key: K, index: number): this
}