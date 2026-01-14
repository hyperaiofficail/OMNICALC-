/**
 * Registry.js
 * Manages the registration and discovery of calculator modules.
 */
export class Registry {
    constructor() {
        this.modules = new Map();
    }

    /**
     * Registers a new calculator module.
     * @param {CalculatorModule} module
     */
    register(module) {
        if (this.modules.has(module.id)) {
            console.warn(`Module ${module.id} is already registered. Overwriting.`);
        }
        this.modules.set(module.id, module);
        console.log(`[Registry] Registered module: ${module.id}`);
    }

    /**
     * Finds a module by ID.
     * @param {string} id
     * @returns {CalculatorModule|undefined}
     */
    get(id) {
        return this.modules.get(id);
    }

    /**
     * Returns all registered modules.
     * @returns {CalculatorModule[]}
     */
    getAll() {
        return Array.from(this.modules.values());
    }
}

// Singleton instance
export const registry = new Registry();
