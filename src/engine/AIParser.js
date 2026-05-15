import { getAllCalculators } from './CalculatorRegistry.js';

/**
 * Real AI intent detection using Gemini API (if configured), falling back to heuristics.
 *
 * @param {string} input - The user's text input
 * @returns {Promise<{id: string, initialData: any, explanation: string}>}
 */
export const parseIntent = async (input) => {
  const lower = input.toLowerCase().trim();

  // 0. Check for empty
  if (!lower) return { id: null, explanation: "Please enter a calculation request." };

  const calculators = getAllCalculators();

  // Try calling real LLM API first
  try {
    const apiKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) ||
                   (typeof localStorage !== 'undefined' ? localStorage.getItem('gemini_api_key') : null);

    if (apiKey) {
      const prompt = `
You are an intent detection engine for a calculator platform.
Given the user input, decide which calculator is the best fit.
Available calculators:
${calculators.map(c => `- ID: ${c.id}, Name: ${c.name}, Desc: ${c.description}`).join('\n')}

User input: "${input}"

Respond ONLY with a JSON object in the following format, with no markdown formatting, backticks, or extra text:
{"id": "selected_calculator_id", "explanation": "A short explanation of why this was chosen", "initialData": {}}
If none fit, or if it is a general math expression, use id "scientific".
`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          try {
            // Clean up potentially wrapped JSON (e.g. ```json ... ```)
            const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
            const parsed = JSON.parse(cleanText);
            if (parsed && parsed.id) {
              return {
                id: parsed.id,
                initialData: parsed.initialData || {},
                explanation: parsed.explanation || "Selected via AI intent detection."
              };
            }
          } catch (parseError) {
             console.warn("Failed to parse LLM response as JSON:", text, parseError);
          }
        }
      } else {
         console.warn("LLM API error:", response.status, response.statusText);
      }
    }
  } catch (error) {
    console.warn("Error calling LLM API, falling back to heuristics:", error);
  }

  // 1. Scoring System (Fallback)
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
