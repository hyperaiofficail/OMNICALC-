import { getAllCalculators } from './CalculatorRegistry.js';

/**
 * Simulates AI intent detection.
 * In a real app, this would call an LLM API.
 *
 * @param {string} input - The user's text input
 * @returns {Promise<{id: string, initialData: any, explanation: string}>}
 */
export const parseIntent = async (input) => {
  const lower = input.toLowerCase().trim();

  // 0. Check for empty
  if (!lower) return { id: null, explanation: "Please enter a calculation request." };

  const calculators = getAllCalculators();

  // 1. Scoring System
  let bestMatch = null;
  let maxScore = 0;

  for (const calc of calculators) {
    let score = 0;

    // Name Match
    const lowerName = calc.name.toLowerCase();
    if (lower.includes(lowerName)) {
        score += 20;
    } else {
        // Partial Name Match (e.g. "BMI" from "BMI Calculator")
        const nameWords = lowerName.split(' ');
        let matches = 0;
        nameWords.forEach(word => {
            if (word.length >= 2 && lower.includes(word)) matches++;
        });
        if (matches > 0) score += matches * 5;
    }

    // Tag Match
    if (calc.tags && calc.tags.some(tag => lower.includes(tag.toLowerCase()))) score += 10;

    // Description Match
    if (calc.description && lower.includes(calc.description.toLowerCase())) score += 5;

    if (score > maxScore) {
      maxScore = score;
      bestMatch = calc.id;
    }
  }

  // 2. Heuristic Overrides (Simulating "Smart" understanding)

  // Math expressions (e.g., "5+5", "sin(90)")
  const mathRegex = /^[\d\.\(\)\+\-\*\/\^\!\s%eπa-z]+$/i;
  // A rough check if it looks like a math expression and not just words
  const isMath = mathRegex.test(lower) && /\d/.test(lower);

  if (isMath && (!bestMatch || maxScore < 15)) {
    // Clean up expression
    let cleanExpr = input.replace(/calculate\s+/i, '').replace(/solve\s+/i, '').replace(/evaluate\s+/i, '');
    return {
        id: 'scientific',
        initialData: { expression: cleanExpr },
        explanation: "Detected a mathematical expression."
    };
  }

  // Return best match found via keywords
  if (bestMatch) {
      const calc = calculators.find(c => c.id === bestMatch);
      return {
          id: bestMatch,
          initialData: {}, // Could parse params here in future
          explanation: `Selected ${calc.name} based on your input.`
      };
  }

  // Default fallback
  return {
      id: 'scientific',
      initialData: {},
      explanation: "I'm not sure which specific tool you need, so I've opened the general calculator."
  };
};
