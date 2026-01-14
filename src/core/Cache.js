/**
 * Cache Manager
 * Implements an LRU (Least Recently Used) caching strategy.
 */
export class CacheManager {
  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  /**
   * Generate a unique key for the calculation.
   * @param {string} formula
   * @param {object} params
   */
  generateKey(formula, params = {}) {
    // Simple hashing: stringify formula and sorted params
    const paramKey = JSON.stringify(params, Object.keys(params).sort());
    return `${formula}::${paramKey}`;
  }

  get(key) {
    if (this.cache.has(key)) {
      // Refresh item (LRU behavior)
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Evict least recently used (first item in Map)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}
