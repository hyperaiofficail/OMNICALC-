import React, { useState } from 'react';

export const BMICalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);

  const calculate = () => {
    if (!height || !weight) return;
    const h = parseFloat(height) / 100; // cm to m
    const w = parseFloat(weight);
    const val = w / (h * h);
    setBmi(val.toFixed(1));
  };

  const getStatus = (val) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
    if (val < 25) return { label: 'Normal weight', color: 'text-green-400' };
    if (val < 30) return { label: 'Overweight', color: 'text-yellow-400' };
    return { label: 'Obese', color: 'text-red-400' };
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gemini-surface p-6 rounded-xl border border-white/5">
        <h3 className="text-xl font-bold mb-4">Body Mass Index (BMI)</h3>

        <div className="space-y-4">
            <div>
                <label className="block text-sm text-gray-400 mb-1">Height (cm)</label>
                <input
                    type="number"
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    className="w-full bg-gemini-dark border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors"
                    placeholder="e.g. 175"
                />
            </div>
            <div>
                <label className="block text-sm text-gray-400 mb-1">Weight (kg)</label>
                <input
                    type="number"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    className="w-full bg-gemini-dark border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors"
                    placeholder="e.g. 70"
                />
            </div>

            <button
                onClick={calculate}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
            >
                Calculate BMI
            </button>
        </div>

        {bmi && (
            <div className="mt-6 text-center animate-fade-in p-4 bg-white/5 rounded-lg border border-white/5">
                <div className="text-sm text-gray-400">Your BMI</div>
                <div className="text-5xl font-bold text-white mb-2">{bmi}</div>
                <div className={`text-lg font-medium ${getStatus(bmi).color}`}>
                    {getStatus(bmi).label}
                </div>

                {/* Visual Scale */}
                <div className="mt-6 relative pt-2">
                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden flex">
                        <div className="w-[18.5%] bg-blue-400 opacity-50"></div>
                        <div className="w-[16.25%] bg-green-400 opacity-50"></div>
                        <div className="w-[12.5%] bg-yellow-400 opacity-50"></div>
                        <div className="flex-1 bg-red-400 opacity-50"></div>
                    </div>
                    {/* Marker */}
                    <div
                        className="w-4 h-4 bg-white rounded-full absolute top-1 border-2 border-gemini-dark shadow transform -translate-x-1/2 transition-all duration-500"
                        style={{ left: `${Math.min(Math.max((bmi / 40) * 100, 0), 100)}%` }}
                    ></div>

                    <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                        <span>0</span>
                        <span>18.5</span>
                        <span>25</span>
                        <span>30</span>
                        <span>40+</span>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
