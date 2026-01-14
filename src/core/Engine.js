let create, all;

if (typeof window !== 'undefined' && window.math) {
  create = window.math.create;
  all = window.math.all;
} else {
  const m = await import('mathjs');
  create = m.create;
  all = m.all;
}

// Configure mathjs for high precision and predictable behavior
const config = {
  epsilon: 1e-60,
  matrix: 'Matrix',
  number: 'BigNumber', // Default to BigNumber for precision
  precision: 64,       // High precision
  predictable: true,
  randomSeed: null
};

const math = create(all, config);

/**
 * Core Execution Engine
 * Handles deterministic math execution with high precision.
 */
export class Engine {
  constructor() {
    this.math = math;
  }

  /**
   * Execute a mathematical expression.
   * @param {string} expression - The formula or expression to evaluate.
   * @param {object} scope - Variables to pass to the expression.
   * @returns {object} - { result, timeMs, error }
   */
  evaluate(expression, scope = {}) {
    const start = performance.now();
    try {
      // Compile first for potential speedup on repeated calls (though here we eval once)
      // For a platform, we might cache compiled code.
      const code = this.math.compile(expression);
      const result = code.evaluate(scope);

      // Format the result
      let formattedResult;
      if (this.math.isBigNumber(result)) {
        formattedResult = result.toString();
      } else if (typeof result === 'number') {
         formattedResult = result;
      } else {
         formattedResult = this.math.format(result, { precision: 14 });
      }

      const end = performance.now();
      return {
        result: formattedResult,
        rawResult: result,
        timeMs: end - start,
        error: null
      };
    } catch (err) {
        const end = performance.now();
        return {
        result: null,
        timeMs: end - start,
        error: err.message
      };
    }
  }

  /**
   * Configure engine precision.
   * @param {number} precision
   */
  setPrecision(precision) {
      this.math.config({ precision });
  }
}
