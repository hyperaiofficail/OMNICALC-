import React, { useState } from 'react';

export const LoanCalculator = () => {
  const [amount, setAmount] = useState('200000');
  const [rate, setRate] = useState('5');
  const [years, setYears] = useState('30');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const P = parseFloat(amount);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(years) * 12;

    if (!P || !r || !n) return;

    // M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
    const x = Math.pow(1 + r, n);
    const monthly = (P * x * r) / (x - 1);

    setResult({
        monthly: monthly.toFixed(2),
        total: (monthly * n).toFixed(2),
        interest: ((monthly * n) - P).toFixed(2)
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gemini-surface p-6 rounded-xl border border-white/5 grid md:grid-cols-2 gap-8">
        <div>
            <h3 className="text-xl font-bold mb-4">Loan Calculator</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Loan Amount ($)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-full bg-gemini-dark border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Interest Rate (% per year)</label>
                    <input
                        type="number"
                        value={rate}
                        onChange={e => setRate(e.target.value)}
                        className="w-full bg-gemini-dark border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Loan Term (years)</label>
                    <input
                        type="number"
                        value={years}
                        onChange={e => setYears(e.target.value)}
                        className="w-full bg-gemini-dark border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors"
                    />
                </div>
                <button
                    onClick={calculate}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                >
                    Calculate
                </button>
            </div>
        </div>

        <div className="flex flex-col justify-center">
            {result ? (
                <div className="bg-white/5 p-6 rounded-xl border border-white/5 animate-fade-in text-center">
                    <div className="mb-6">
                        <div className="text-sm text-gray-400 mb-1">Monthly Payment</div>
                        <div className="text-4xl font-bold text-blue-400">${Number(result.monthly).toLocaleString()}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                            <div className="text-gray-400">Total Payment</div>
                            <div className="text-white font-medium">${Number(result.total).toLocaleString()}</div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                            <div className="text-gray-400">Total Interest</div>
                            <div className="text-white font-medium">${Number(result.interest).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm italic p-10 border-2 border-dashed border-white/5 rounded-xl">
                    Enter details to see breakdown
                </div>
            )}
        </div>
    </div>
  );
};
