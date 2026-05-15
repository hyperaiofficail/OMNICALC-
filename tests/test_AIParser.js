import { parseIntent } from '../src/engine/AIParser.js';
import { registerCalculator } from '../src/engine/CalculatorRegistry.js';
import assert from 'assert';

registerCalculator({
  id: 'bmi',
  name: 'BMI Calculator',
  tags: ['health', 'fitness'],
  description: 'Calculates Body Mass Index'
});

registerCalculator({
  id: 'mortgage',
  name: 'Mortgage Calculator',
  tags: ['finance', 'home'],
  description: 'Calculates monthly mortgage payments'
});

async function runTests() {
  const t1 = await parseIntent('Calculate my BMI');
  assert.strictEqual(t1.id, 'bmi');

  const t2 = await parseIntent('I want to calculate mortgage');
  assert.strictEqual(t2.id, 'mortgage');

  const t3 = await parseIntent('Solve 5 + 5');
  assert.strictEqual(t3.id, 'scientific');

  const t4 = await parseIntent('health tool');
  assert.strictEqual(t4.id, 'bmi');

  console.log('All tests passed!');
}

runTests().catch(console.error);
