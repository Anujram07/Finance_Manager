// src/Components/FinancialChatbot.jsx
import React, { useState, useRef, useEffect } from 'react';

export default function FinancialChatbot({ 
  incomes = [], 
  expenses = [], 
  totalMinIncome = 0, 
  totalMaxExpense = 0, 
  conservativeNetSavings = 0 
}) {
  const [messages, setMessages] = useState([
    { role: 'model', text: "Hello! I am your AI Finance Assistant. Ask me anything about your current inflows, outflows, or savings goals!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Updated to keep your active API key string
 const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  
  // ✅ FIXED: Changed model to gemini-2.5-flash to avoid the v1beta deprecation error
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const systemContext = `
      You are a specialized personal finance AI assistant embedded directly within the user's budgeting dashboard. 
      Analyze the user's real-time financial profile provided below and answer their query accurately, strictly keeping currency amounts in INR (₹). 
      Keep answers concise, actionable, and structured with clean formatting.

      ### USER'S LIVE FINANCIAL DATA:
      - Total Minimum Income: ₹${totalMinIncome.toLocaleString('en-IN')}
      - Total Maximum Expenses: ₹${totalMaxExpense.toLocaleString('en-IN')}
      - Conservative Net Savings: ₹${conservativeNetSavings.toLocaleString('en-IN')}

      Inflows (Income Streams currently added):
      ${incomes.length === 0 ? "No income items added yet." : incomes.map(i => `- ${i.name} (${i.type}): ₹${i.min} to ₹${i.max}`).join('\n')}

      Outflows (Expenses currently added):
      ${expenses.length === 0 ? "No expense items added yet." : expenses.map(e => `- ${e.name} (${e.type})${e.important ? ' [🛡️ Marked Important]' : ''}: ₹${e.min} to ₹${e.max}`).join('\n')}
    `;

    const contentsPayload = [
      {
        role: 'user',
        parts: [{ text: `${systemContext}\n\nAcknowledge this financial data context silently and prepare to answer user queries.` }]
      },
      ...messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      })),
      {
        role: 'user',
        parts: [{ text: userMessage }]
      }
    ];

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: contentsPayload })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "Sorry, I ran into an issue parsing the data. Please try again." }]);
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to the AI assistant. Please check your network connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[500px] w-full">
      <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50 rounded-t-2xl">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        <h3 className="font-extrabold text-sm text-slate-900">AI Budget Copilot</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap shadow-sm ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-br-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 text-slate-400 rounded-2xl rounded-bl-none p-3 text-xs italic shadow-sm flex items-center gap-2">
              <span className="flex space-x-1">
                <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              </span>
              Analyzing your balances...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex gap-2 bg-white rounded-b-2xl">
        <input
          type="text"
          placeholder="Ask e.g., 'Can I afford a ₹15,000 expense?'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 p-2.5 border border-slate-200 text-xs bg-white rounded-xl outline-none focus:border-slate-400 transition"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-slate-900 text-white text-xs font-bold px-4 rounded-xl hover:bg-slate-800 transition disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}