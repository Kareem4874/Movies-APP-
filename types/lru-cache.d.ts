declare module 'lru-cache' {
  export interface LRUCacheOptions {
    max?: number;
    ttl?: number;
  }

  class LRUCache<K = string, V = unknown> {
    constructor(options?: LRUCacheOptions);
    get(key: K): V | undefined;
    set(key: K, value: V): void;
    delete(key: K): boolean;
    clear(): void;
  }

  export = LRUCache;
}
