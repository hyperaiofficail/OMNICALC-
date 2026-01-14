import { Engine } from '../src/core/Engine.js';
import { CacheManager } from '../src/core/Cache.js';
import { registry } from '../src/core/Registry.js';
import { IntentParser } from '../src/ai/IntentParser.js';
import { calculators } from '../src/calculators/index.js';

describe('OmniCalc Performance & Stability', () => {
  let engine;
  let cache;
  let parser;

  beforeAll(() => {
    engine = new Engine();
    cache = new CacheManager();
    parser = new IntentParser(registry);
    calculators.forEach(c => registry.register(c));
  });

  test('Sub-100ms response time for standard calculations', () => {
    const start = performance.now();
    const res = engine.evaluate('12345 * 67890');
    const end = performance.now();
    const duration = end - start;

    expect(duration).toBeLessThan(100);
    expect(res.result).toBe('838102050');
  });

  test('Precision: Factorial of 100', () => {
    const res = engine.evaluate('100!');
    // 100! is approx 9.33e157. BigNumber should handle it.
    expect(res.result).toMatch(/9\.332621544.*e\+157/);
  });

  test('Cache effectiveness', () => {
    const key = cache.generateKey('test', { a: 1 });
    cache.set(key, 'result');

    const start = performance.now();
    const cached = cache.get(key);
    const end = performance.now();

    expect(cached).toBe('result');
    expect(end - start).toBeLessThan(1); // Cache retrieval should be instant
  });

  test('AI Parser latency', async () => {
     const start = performance.now();
     const intent = await parser.parse('calculate bmi for 80kg and 1.80m');
     const end = performance.now();

     expect(end - start).toBeLessThan(50); // Parsing should be fast
     expect(intent.calculatorId).toBe('health_bmi');
  });

  test('Full flow: Loan calculation', async () => {
      // Simulate full request
      const input = "loan 200000 5% 30 years";

      const start = performance.now();
      const intent = await parser.parse(input);
      const calculator = registry.get(intent.calculatorId);
      const res = calculator.calculate(engine, intent.params);
      const end = performance.now();

      expect(end - start).toBeLessThan(100); // Total budget
      expect(parseFloat(res.result)).toBeCloseTo(1073.64, 2);
  });
});
