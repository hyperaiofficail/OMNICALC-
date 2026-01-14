import React from 'react';
import { getCalculator } from '../../engine/CalculatorRegistry';

export const CalculatorWorkspace = ({ id, initialData }) => {
  const calcConfig = getCalculator(id);

  if (!calcConfig) {
    return (
      <div className="h-full flex items-center justify-center text-red-400">
        Calculator not found: {id}
      </div>
    );
  }

  const Component = calcConfig.component;

  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-sm">
         <h2 className="text-lg font-semibold flex items-center gap-2">
            {calcConfig.name}
            <span className="text-xs font-normal text-gray-400 px-2 py-0.5 rounded bg-white/10">AI Enhanced</span>
         </h2>
      </div>
      <div className="flex-1 overflow-auto p-4 flex justify-center bg-gemini-dark/50">
        <Component initialData={initialData} />
      </div>
    </div>
  );
};
