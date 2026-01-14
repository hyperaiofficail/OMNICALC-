export const BasicMath = {
  id: 'basic_math',
  name: 'Basic Calculator',
  description: 'Performs basic arithmetic operations (+, -, *, /, ^).',
  tags: ['math', 'basic', 'general'],
  inputs: ['expression'],
  calculate: (engine, { expression }) => {
    return engine.evaluate(expression);
  }
};
