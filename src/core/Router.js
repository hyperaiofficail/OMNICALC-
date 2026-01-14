/**
 * Router.js
 * The "AI" Interpretation Layer.
 * Analyzes input and routes to the appropriate calculator module.
 */
import { registry } from './Registry.js';

export class Router {
    constructor() {
    }

    /**
     * Analyzes the user input and returns the best matching module and parsed parameters.
     * @param {string} input
     * @returns {Promise<{module: CalculatorModule, params: any} | null>}
     */
    async route(input) {
        const lowerInput = input.toLowerCase();

        // 1. Check for Mortgage keywords
        if (lowerInput.includes('mortgage') || lowerInput.includes('loan')) {
            const module = registry.get('calc-finance');
            if (module) return { module, params: { original: input } };
        }

        // 2. Check for Math/Scientific expressions
        // If it contains digits and math operators, or trig functions
        if (/[\d\+\-\*\/\^]/.test(input) || /sin|cos|tan|log|sqrt|pi/.test(lowerInput)) {
            const module = registry.get('calc-scientific');
            if (module) return { module, params: { expression: input } };
        }

        // Default fallback: Try Scientific for everything else if it looks like math
        const sciModule = registry.get('calc-scientific');
        if (sciModule) return { module: sciModule, params: { expression: input } };

        return null;
    }
}

export const router = new Router();
