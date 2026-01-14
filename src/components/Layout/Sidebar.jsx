import React from 'react';
import { getAllCalculators } from '../../engine/CalculatorRegistry';

export const Sidebar = ({ isOpen, toggle, onSelect, activeId }) => {
  const calculators = getAllCalculators();

  return (
    <div className={`${isOpen ? 'w-64' : 'w-0'} bg-gemini-surface border-r border-white/5 transition-all duration-300 flex flex-col overflow-hidden whitespace-nowrap relative`}>
      <div className="p-4 border-b border-white/5 flex justify-between items-center min-w-[256px]">
        <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">OmniCalc</span>
        <button onClick={toggle} className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 min-w-[256px]">
        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 px-2 mt-2">Available Tools</div>
        <div className="space-y-0.5">
            {calculators.length === 0 && (
                <div className="px-2 text-sm text-gray-600">No calculators loaded.</div>
            )}
            {calculators.map(calc => (
                <button
                    key={calc.id}
                    onClick={() => onSelect(calc.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${activeId === calc.id ? 'bg-blue-500/10 text-blue-400 font-medium' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                >
                   {calc.name}
                </button>
            ))}
        </div>
      </div>

      <div className="p-4 border-t border-white/5 min-w-[256px]">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-xs">AI</div>
            <div className="text-sm text-gray-300">Pro User</div>
        </div>
      </div>
    </div>
  );
};
