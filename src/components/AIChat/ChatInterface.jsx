import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

export const ChatInterface = ({ onQuery, centered, compact }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    await onQuery(input);
    setLoading(false);
    setInput('');
  };

  return (
    <div className={`w-full transition-all duration-500`}>
      <form onSubmit={handleSubmit} className="relative group">
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        <div className="relative flex items-center bg-gemini-surface border border-white/10 rounded-2xl shadow-lg focus-within:ring-2 focus-within:ring-blue-500/50 transition-all overflow-hidden">
            <div className="pl-4 text-blue-400">
                <Sparkles size={20} />
            </div>
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything... (e.g., 'Calculate 5!')"
            className="w-full bg-transparent text-white p-4 outline-none placeholder-gray-500"
            />
            <button
                type="submit"
                disabled={loading}
                className="p-3 mr-1 text-gray-400 hover:text-white disabled:opacity-50 hover:bg-white/5 rounded-xl transition-colors"
            >
            <Send size={20} />
            </button>
        </div>
      </form>
    </div>
  );
};
