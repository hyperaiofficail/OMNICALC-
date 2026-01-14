import React, { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { ChatInterface } from './components/AIChat/ChatInterface';
import { CalculatorWorkspace } from './components/Workspace/CalculatorWorkspace';
import { parseIntent } from './engine/AIParser';

function App() {
  const [activeCalculatorId, setActiveCalculatorId] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleUserQuery = async (query) => {
    // 1. Process with AI
    const result = await parseIntent(query);

    // 2. Set Calculator
    if (result.id) {
      setActiveCalculatorId(result.id);
      setInitialData(result.initialData);
    }

    return result;
  };

  return (
    <div className="flex h-screen bg-gemini-dark text-white overflow-hidden font-sans relative">
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onSelect={setActiveCalculatorId}
        activeId={activeCalculatorId}
      />

      {/* Toggle Button when sidebar is closed */}
      {!isSidebarOpen && (
        <div className="absolute top-4 left-4 z-50 animate-fade-in">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-gemini-surface rounded-lg text-gray-400 hover:text-white border border-white/10 shadow-lg hover:bg-white/5 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
            </button>
        </div>
      )}

      <main className="flex-1 flex flex-col relative transition-all duration-300">
        <div className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col">
           {!activeCalculatorId ? (
             <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-red-400 bg-clip-text text-transparent mb-6 tracking-tight">
                  OmniCalc AI
                </h1>
                <p className="text-gray-400 mb-8 text-lg">
                  What would you like to calculate today?
                </p>
                <div className="w-full max-w-2xl">
                  <ChatInterface onQuery={handleUserQuery} centered={true} />
                </div>

                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                  {['Scientific', 'Finance', 'Health', 'Physics'].map(cat => (
                    <div key={cat} className="p-3 border border-white/5 rounded-lg bg-white/5 text-center cursor-pointer hover:bg-white/10 transition-colors">
                      {cat}
                    </div>
                  ))}
                </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col animate-slide-up h-full">
                <div className="flex-1 overflow-y-auto mb-4 bg-gemini-surface rounded-2xl border border-white/5 shadow-2xl relative">
                   <CalculatorWorkspace id={activeCalculatorId} initialData={initialData} />
                </div>
                <div className="w-full max-w-3xl mx-auto">
                   <ChatInterface onQuery={handleUserQuery} centered={false} compact={true} />
                </div>
             </div>
           )}
        </div>
      </main>
    </div>
  );
}

export default App;
