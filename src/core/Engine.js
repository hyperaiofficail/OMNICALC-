/**
 * Engine.js
 * The Deterministic Calculation Engine.
 * Orchestrates execution.
 */
import { router } from './Router.js';

export class Engine {
    constructor() {
        this.history = [];
        this.cache = new Map();
        this.MAX_CACHE_SIZE = 500;
    }

    /**
     * Process a user request.
     * @param {string} input
     * @returns {Promise<ExecutionResult>}
     */
    async process(input) {
        // 0. Check Cache
        if (this.cache.has(input)) {
            console.log(`[Engine] Cache hit for: "${input}"`);
            const cachedResult = this.cache.get(input);
            this.history.push({ input, ...cachedResult, fromCache: true });
            return { ...cachedResult, fromCache: true };
        }

        // 1. Interpret Intent
        const route = await router.route(input);

        if (!route) {
            return {
                success: false,
                error: "I'm not sure how to calculate that yet. Try a math formula or 'mortgage'.",
                module: null
            };
        }

        const { module, params } = route;

        // 2. Execute Module
        try {
            const start = performance.now();
            const result = await module.calculate(params);
            const end = performance.now();

            const executionResult = {
                success: true,
                result: result.value,
                display: result.display, // Structured data for UI
                steps: result.steps,
                meta: {
                    module: module.metadata.name,
                    timeMs: (end - start).toFixed(2)
                }
            };

            // Cache Successful Results
            if (this.cache.size >= this.MAX_CACHE_SIZE) {
                const first = this.cache.keys().next().value;
                this.cache.delete(first);
            }
            this.cache.set(input, executionResult);

            this.history.push({ input, ...executionResult });
            return executionResult;

        } catch (e) {
            console.error("Calculation Error:", e);
            return {
                success: false,
                error: e.message || "An unexpected error occurred during calculation.",
                module: module.metadata.name
            };
        }
    }
}

export const engine = new Engine();
