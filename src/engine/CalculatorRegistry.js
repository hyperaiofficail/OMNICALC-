/**
 * Registry for all calculator modules.
 * Each calculator has:
 * - id: unique string
 * - name: display name
 * - description: for AI indexing
 * - component: React component
 * - tags: categories
 */

const registry = new Map();

export const registerCalculator = (config) => {
  if (registry.has(config.id)) {
    console.warn(`Overwriting calculator with ID: ${config.id}`);
  }
  registry.set(config.id, config);
};

export const getCalculator = (id) => {
  return registry.get(id);
};

export const getAllCalculators = () => {
  return Array.from(registry.values());
};

// Helper to init registry with default imported calculators
// (We will call this in main.jsx or App.jsx)
export const initRegistry = (calculators = []) => {
  calculators.forEach(registerCalculator);
};
