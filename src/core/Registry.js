/**
 * Calculator Registry
 * Manages the registration and retrieval of calculator modules.
 * Supports lazy loading pattern.
 */
export class Registry {
  constructor() {
    this.calculators = new Map();
  }

  /**
   * Register a calculator module.
   * @param {object} calculator
   */
  register(calculator) {
    if (!calculator.id || !calculator.calculate) {
      throw new Error('Invalid calculator module');
    }
    this.calculators.set(calculator.id, calculator);
  }

  /**
   * Get a calculator by ID.
   * @param {string} id
   * @returns {object|null}
   */
  get(id) {
    return this.calculators.get(id) || null;
  }

  /**
   * Get all registered calculators (metadata only).
   */
  list() {
    return Array.from(this.calculators.values()).map(c => ({
      id: c.id,
      name: c.name,
      description: c.description,
      tags: c.tags,
      inputs: c.inputs
    }));
  }

  /**
   * Find calculators by tag.
   * @param {string} tag
   */
  findByTag(tag) {
    return this.list().filter(c => c.tags.includes(tag));
  }
}

export const registry = new Registry();
