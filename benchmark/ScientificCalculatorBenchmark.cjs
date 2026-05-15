const { performance } = require('perf_hooks');

const currentImplementation = (expression) => {
    let raw = expression;
    raw = raw.replace(/π/g, 'pi');
    raw = raw.replace(/e/g, 'e');
    raw = raw.replace(/×/g, '*');
    raw = raw.replace(/÷/g, '/');
    raw = raw.replace(/√/g, 'sqrt');
    raw = raw.replace(/ln\(/g, 'log(');
    raw = raw.replace(/log\(/g, 'log10(');
    return raw;
};

const MATH_SYMBOLS_MAP = {
    'π': 'pi',
    'e': 'e',
    '×': '*',
    '÷': '/',
    '√': 'sqrt',
    'ln(': 'log(',
    'log(': 'log10('
};
const MATH_SYMBOLS_REGEX = /π|e|×|÷|√|ln\(|log\(/g;

const optimizedImplementation = (expression) => {
    return expression.replace(MATH_SYMBOLS_REGEX, match => MATH_SYMBOLS_MAP[match]);
};

// Generate test data
const expressions = [];
for (let i = 0; i < 10000; i++) {
    expressions.push(`ln(π) × log(e) ÷ √(100) + ${i}`);
}

const runBenchmark = () => {
    console.log("Warming up...");
    for (let i = 0; i < 1000; i++) {
        currentImplementation(expressions[i]);
        optimizedImplementation(expressions[i]);
    }

    console.log("Running Current Implementation...");
    const start1 = performance.now();
    for (const exp of expressions) {
        currentImplementation(exp);
    }
    const end1 = performance.now();
    const time1 = end1 - start1;
    console.log(`Current: ${time1.toFixed(2)}ms`);

    console.log("Running Optimized Implementation...");
    const start2 = performance.now();
    for (const exp of expressions) {
        optimizedImplementation(exp);
    }
    const end2 = performance.now();
    const time2 = end2 - start2;
    console.log(`Optimized: ${time2.toFixed(2)}ms`);

    console.log(`Improvement: ${((time1 - time2) / time1 * 100).toFixed(2)}%`);
};

runBenchmark();
