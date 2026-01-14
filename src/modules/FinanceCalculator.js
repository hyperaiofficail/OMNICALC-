import { BaseCalculator } from './BaseCalculator.js';

export class FinanceCalculator extends BaseCalculator {
    constructor() {
        super('calc-finance', {
            name: 'Finance & Loan Calculator',
            description: 'Calculates mortgages, loans, and interest.',
            version: '1.0.0',
            tags: ['finance', 'money', 'mortgage']
        });
    }

    validate(params) {
        // We expect a string input that we can try to parse, or structured params
        return true;
    }

    async calculate(params) {
        // Simple heuristic parsing for "Mortgage for 500k at 5.5%"
        // In a real app, the AI Router would extract these numbers.
        // Here we do a quick regex if it's a string.

        let principal = 0;
        let rate = 0;
        let years = 30; // default

        if (typeof params.original === 'string') {
            const pMatch = params.original.match(/(\d+)(k?)/i);
            const rMatch = params.original.match(/(\d+(\.\d+)?)%/);

            if (pMatch) {
                principal = parseFloat(pMatch[1]);
                if (pMatch[2].toLowerCase() === 'k') principal *= 1000;
            }
            if (rMatch) {
                rate = parseFloat(rMatch[1]);
            }
        }

        if (principal === 0 || rate === 0) {
            throw new Error("Could not extract Principal and Rate from input. Try 'Mortgage 500000 at 5%'.");
        }

        const r = rate / 100 / 12;
        const n = years * 12;

        // M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
        const monthlyPayment = principal * ( (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) );

        const finalValue = monthlyPayment.toFixed(2);

        return {
            value: finalValue,
            display: {
                type: 'card',
                title: 'Monthly Payment',
                content: `$${finalValue}`,
                subtext: `${years} Year Fixed • ${rate}% Interest • $${principal.toLocaleString()} Loan`
            },
            steps: [
                `Principal: $${principal}`,
                `Annual Rate: ${rate}%`,
                `Term: ${years} years`,
                `Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]`
            ]
        };
    }
}
