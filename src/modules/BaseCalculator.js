/**
 * BaseCalculator.js
 * Interface for all calculator modules.
 */
export class BaseCalculator {
    constructor(id, metadata) {
        if (this.constructor === BaseCalculator) {
            throw new Error("Abstract class 'BaseCalculator' cannot be instantiated directly.");
        }
        this.id = id;
        this.metadata = metadata; // { name, description, version, tags }
    }

    /**
     * Validates if the module can handle the input parameters.
     * @param {any} params
     * @returns {boolean}
     */
    validate(params) {
        throw new Error("Method 'validate()' must be implemented.");
    }

    /**
     * Performs the calculation.
     * @param {any} params
     * @returns {Promise<{value: any, display: any, steps: string[]}>}
     */
    async calculate(params) {
        throw new Error("Method 'calculate()' must be implemented.");
    }
}
