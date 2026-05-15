import { parseIntent } from '../src/engine/AIParser.js';
import { registerCalculator } from '../src/engine/CalculatorRegistry.js';

// Setup mock registry
for (let i = 0; i < 5000; i++) {
  registerCalculator({
    id: `calc_${i}`,
    name: `Calculator ${i}`,
    tags: [`tag${i}`, `math`],
    description: `Description for calculator ${i}`
  });
}

const inputs = [
  "Calculate my BMI",
  "Solve 5 + 5",
  "What is the Mortgage for a $500,000 home?",
  "Calculate something unknown",
  "Evaluate 10 * 10",
  "Scientific calculator please",
  "I need a Mortgage tool",
  "Calculate the distance between two points",
  "12345 * 67890",
  "Random words that don't match anything"
];

async function runBenchmark() {
  const iterations = 1000;
  console.log(`Running AIParser benchmark with ${iterations} iterations and 5000 registered calculators...`);

  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    for (const input of inputs) {
      await parseIntent(input);
    }
  }
  const end = performance.now();

  const totalTime = end - start;
  const timePerCall = totalTime / (iterations * inputs.length);

  console.log(`Total time: ${totalTime.toFixed(2)} ms`);
  console.log(`Average time per call: ${timePerCall.toFixed(4)} ms`);
}

runBenchmark();
