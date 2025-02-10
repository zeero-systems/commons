export class HashMap<K, A> extends Map<K, Map<K, A>> {
  constructor() {
    super(new Map<K, Map<K, A>>());
  }

  override has(key: K, name?: K): boolean {
    if (name) {
      return super.has(key) && super.get(key)?.has(name) as boolean;
    }
    return super.has(key);
  }

  add(key: K, name: K, value: A): void {
    if (!this.has(key)) {
      this.set(key, new Map());
    }
    super.get(key)?.set(name, value);
  }

  retrieve(key: K, name?: K): Map<K, A> | A | undefined {
    if (name) {
      return super.get(key)?.get(name);
    }
    return super.get(key);
  }
}

export default HashMap;
