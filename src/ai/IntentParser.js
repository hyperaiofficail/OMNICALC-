/**
 * AI Intent Parser
 * Simulates an AI model that determines the user's intent and extracts parameters.
 * In a real production system, this would call an LLM (e.g., Gemini) or an NLP service.
 */
export class IntentParser {
  constructor(registry) {
    this.registry = registry;
  }

  /**
   * Parse the user input to find the best matching calculator.
   * @param {string} input
   * @returns {object} - { calculatorId, params, confidence }
   */
  async parse(input) {
    const lowerInput = input.toLowerCase();
    const calculators = this.registry.list();

    // 1. Check for specific keywords mapping to specific calculators
    // This is a heuristic simulation of "Smart Intent Detection"

    // BMI
    if (lowerInput.includes('bmi') || (lowerInput.includes('body mass') && lowerInput.includes('index'))) {
      const params = this.extractBMIParams(lowerInput);
      return { calculatorId: 'health_bmi', params, confidence: 0.9 };
    }

    // Loan
    if (lowerInput.includes('loan') || lowerInput.includes('mortgage') || lowerInput.includes('payment')) {
        const params = this.extractLoanParams(lowerInput);
        return { calculatorId: 'finance_loan', params, confidence: 0.9 };
    }

    // 2. Default to Basic Math if it looks like a formula
    if (/[0-9+\-*/^().]/.test(input) && !/[a-z]{3,}/.test(input.replace(/sin|cos|tan|log|ln|sqrt/g, ''))) {
         return { calculatorId: 'basic_math', params: { expression: input }, confidence: 0.95 };
    }

    // 3. Fallback: Search descriptions
    let bestMatch = null;
    let maxScore = 0;

    for (const calc of calculators) {
      let score = 0;
      if (lowerInput.includes(calc.name.toLowerCase())) score += 5;
      for (const tag of calc.tags) {
        if (lowerInput.includes(tag)) score += 2;
      }

      if (score > maxScore) {
        maxScore = score;
        bestMatch = calc;
      }
    }

    if (bestMatch && maxScore > 0) {
      return { calculatorId: bestMatch.id, params: {}, confidence: 0.6 };
    }

    // Final fallback
    return { calculatorId: 'basic_math', params: { expression: input }, confidence: 0.1 };
  }

  extractBMIParams(input) {
      // Very basic extraction for demo
      // "bmi for 70kg and 1.75m"
      const weightMatch = input.match(/(\d+(\.\d+)?)\s*(kg|lbs)/);
      const heightMatch = input.match(/(\d+(\.\d+)?)\s*(m|cm|ft|in)/);

      return {
          weight: weightMatch ? parseFloat(weightMatch[1]) : 70, // default
          height: heightMatch ? parseFloat(heightMatch[1]) : 1.75, // default
          unit: (weightMatch && weightMatch[3] === 'lbs') ? 'imperial' : 'metric'
      };
  }

  extractLoanParams(input) {
      // "loan of 200000 at 5% for 30 years"
      const principalMatch = input.match(/(\d+)\s*(dollars|usd|eur|£|\$)/) || input.match(/(\d{4,})/); // look for large number
      const rateMatch = input.match(/(\d+(\.\d+)?)\s*%/);
      const termMatch = input.match(/(\d+)\s*years/);

      return {
          principal: principalMatch ? parseFloat(principalMatch[1]) : 100000,
          rate: rateMatch ? parseFloat(rateMatch[1]) : 5,
          term: termMatch ? parseFloat(termMatch[1]) : 30
      };
  }
}
