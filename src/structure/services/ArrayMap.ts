class ArrayMap<K, A> extends Map<K, Array<A>> {
  constructor() {
    super(new Map<K, A[]>());
  }

  addUnique(key: K, value: A): this {
    if (!this.has(key)) {
      this.set(key, new Array<A>());
    }
    if (!this.get(key)?.some(v => v === value)) {
      this.get(key)?.push(value);
    }

    return this;
  }

  removeByIndex(key: K, index: number): this {
    if (!this.has(key)) {
      this.get(key)?.splice(index, 1);
    }
    return this;
  }
}

export default ArrayMap;
