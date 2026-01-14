export const LoanCalculator = {
  id: 'finance_loan',
  name: 'Loan Calculator',
  description: 'Calculates monthly loan payments.',
  tags: ['finance', 'business', 'money'],
  inputs: ['principal', 'rate', 'term'], // rate in %, term in years
  calculate: (engine, { principal, rate, term }) => {
    // Formula: P * r * (1+r)^n / ((1+r)^n - 1)
    // r = annual rate / 12 / 100
    // n = term * 12

    // We construct the formula string for the engine to execute
    // This ensures precision
    const r = `(${rate} / 12 / 100)`;
    const n = `(${term} * 12)`;
    const formula = `(${principal} * ${r} * (1 + ${r}) ^ ${n}) / ((1 + ${r}) ^ ${n} - 1)`;

    return engine.evaluate(formula);
  }
};
