import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ArrowRight, Bot, X, SendHorizonal } from 'lucide-react';
import Goal from '../Components/Goal/Goal';

const Dashboard = () => {
  const [finances, setFinances] = useState({
    income: 0,
    expenses: 0,
    savings: 0,
    expenseBreakdown: [],
  });

  const [loan, setLoan] = useState({
    probability: 0,
    eligibleAmount: 0,
    emi: 0,
  });

  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Chatbot State Modifications
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I can help with budgeting, loan eligibility, and savings goals based on your live ledger.' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);



  // Auto Scroll Hook Execution
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  // Integrated Async Gemini AI Chat Engine Handler
  // Integrated Async Gemini AI Chat Engine Handler (with strict Debugging)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userInput = chatInput.trim();
    const userMessage = { id: Date.now(), type: 'user', text: userInput };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);

    try {

      const token =
        localStorage.getItem("authToken");

      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            message: userInput
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Chat failed"
        );
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          text: data.reply
        }
      ]);

    } catch (error) {

      console.error("Chat Error:", error);

      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          text: `⚠️ ${error.message}`
        }
      ]);

    } finally {

      setIsLoading(false);

    }
  };

  useEffect(() => {

    const fetchDashboardData = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) return;

        const response = await fetch(
          "http://localhost:5000/api/finance/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (
          data.success &&
          data.dashboard
        ) {

          const dashboard = data.dashboard;

          setFinances({
            income: dashboard.totalIncome || 0,
            expenses: dashboard.totalExpense || 0,
            savings: dashboard.savings || 0,

            incomeBreakdown:
              dashboard.incomeBreakdown || [],

            expenseBreakdown:
              dashboard.expenseBreakdown || []
          });

          setMonthlyTrends(
            dashboard.trends || []
          );

        }

      } catch (error) {

        console.error(
          "Dashboard Fetch Error:",
          error.message
        );

      }

    };

    const fetchLoanData = async () => {

      try {

        const token =
          localStorage.getItem("token");

        if (!token) return;

        const response = await fetch(
          "http://localhost:5000/api/loan/latest",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (
          data.success &&
          data.loan
        ) {

          setLoan({
            probability:
              data.loan.result?.probability || 0,

            eligibleAmount:
              data.loan.result?.eligibleAmount || 0,

            emi:
              data.loan.result?.emi || 0
          });

        }

      } catch (error) {

        console.error(
          "Loan Fetch Error:",
          error.message
        );

      }

    };

    fetchDashboardData();

    fetchLoanData();

  }, []);

  const trendData = useMemo(() => {

    return monthlyTrends.map(data => ({

      month: `${data.month}/${data.year}`,

      Income:
        Math.max(
          data.totalMinimumIncome || 0,
          0
        ),

      Expense:
        Math.max(
          data.totalMaximumExpense || 0,
          0
        ),

      Savings:
        Math.max(
          data.conservativeNetSavings || 0,
          0
        )

    }));

  }, [monthlyTrends]);

  const incomeSourcesData = useMemo(() => {

    if (
      finances.incomeBreakdown &&
      finances.incomeBreakdown.length > 0
    ) {

      return finances.incomeBreakdown.map(
        (entry, index) => ({
          name: entry.name,
          value: entry.value,
          fill: [
            '#0ea5e9',
            '#10b981',
            '#6366f1',
            '#f59e0b',
            '#f43f5e'
          ][index % 5]
        })
      );
    }

    return [];

  }, [finances]);

  const expenseBreakdownData = useMemo(() => {
    if (finances.expenseBreakdown.length > 0) {
      return finances.expenseBreakdown.map((entry, index) => ({
        name: entry.name,
        value: entry.value,
        color: ['#ec4899', '#3b82f6', '#14b8a6', '#a855f7', '#f43f5e'][index % 5],
      }));
    }

    const fallbackTotal = Math.max(finances.expenses, 1);
    return [
      { name: 'Food', value: Math.max(fallbackTotal * 0.2, 0), color: '#ec4899' },
      { name: 'Rent', value: Math.max(fallbackTotal * 0.4, 0), color: '#3b82f6' },
      { name: 'Travel', value: Math.max(fallbackTotal * 0.12, 0), color: '#14b8a6' },
      { name: 'Shopping', value: Math.max(fallbackTotal * 0.18, 0), color: '#a855f7' },
      { name: 'Entertainment', value: Math.max(fallbackTotal * 0.1, 0), color: '#f43f5e' },
    ];
  }, [finances]);

  const monthlyAnalysisData = useMemo(() => {
    const safeIncome = Math.max(finances.income, 0);
    const safeExpenses = Math.max(finances.expenses, 0);
    const safeSavings = Math.max(safeIncome - safeExpenses, 0);

    return [
      { name: 'Income', value: safeIncome, color: '#10b981' },
      { name: 'Expenses', value: safeExpenses, color: '#f43f5e' },
      { name: 'Savings', value: safeSavings, color: '#0ea5e9' },
    ];
  }, [finances]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-emerald-200/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-200/20 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <button
          onClick={() => setIsChatOpen((prev) => !prev)}
          className={`fixed top-24 right-6 z-20 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-300/70 transition ${isChatOpen ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-emerald-600'}`}
        >
          <Bot size={18} />
          AI Chatbot
        </button>

        {isChatOpen && (
          <div className="fixed right-6 top-32 z-30 w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl shadow-slate-300/60 flex flex-col max-h-[500px]">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
                  <Bot size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Finance Assistant</p>
                  <p className="text-xs text-slate-500">Online</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800">
                <X size={16} />
              </button>
            </div>

            {/* Chat History Viewport container with custom loaders */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-4 min-h-[250px]">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap shadow-sm ${message.type === 'user' ? 'bg-slate-900 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'}`}>
                    {message.text}
                  </div>
                </div>
              ))}

              {/* Context Loading Notification block */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 text-slate-400 rounded-2xl rounded-bl-none p-3 text-xs italic shadow-sm flex items-center gap-2">
                    <span className="flex space-x-1">
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    </span>
                    Calculating ledgers...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-slate-100 bg-white p-3 shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={isLoading ? "Analyzing ledger distributions..." : "Ask about your finances..."}
                disabled={isLoading}
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs outline-none focus:border-emerald-500 transition disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isLoading || !chatInput.trim()}
                className="rounded-full bg-emerald-600 p-2 text-white transition hover:bg-emerald-700 disabled:opacity-40"
              >
                <SendHorizonal size={16} />
              </button>
            </form>
          </div>
        )}

        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-1">
              Financial <span className="text-emerald-600">Insights</span>
            </h2>
            <p className="text-slate-500 font-medium">
              Live automated metric configuration frameworks mapping ledger distributions.
            </p>
          </div>

          {/* SECTION 1: MAIN TREND ANALYSIS GRAPHS */}
          <div className="grid lg:grid-cols-2 gap-8">
            <ChartWrapper title="Income vs Expense Trend">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(val) => [`₹${val.toLocaleString('en-IN')}`]} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 12px 18px -6px rgba(15, 23, 42, 0.18)' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Expense" stroke="#f43f5e" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="Income Stream Breakdown">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={incomeSourcesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(val) => [`₹${val.toLocaleString('en-IN')}`]} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={50} name="Amount" fill="#0ea5e9">
                    {incomeSourcesData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          {/* SECTION 2: METRIC ALLOCATIONS COMPOSITION */}
          <div className="grid lg:grid-cols-2 gap-8">
            <ChartWrapper title="Expense Breakdown">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={expenseBreakdownData} layout="vertical" margin={{ top: 10, right: 20, left: 15, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eef2f7" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                  <Tooltip formatter={(val) => [`₹${val.toLocaleString('en-IN')}`]} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} maxBarSize={24} name="Total Spent">
                    {expenseBreakdownData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="Monthly Balance Breakdown">
              <div className="flex flex-col md:flex-row items-center justify-around h-[320px]">
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={monthlyAnalysisData} innerRadius={60} outerRadius={95} paddingAngle={6} dataKey="value">
                        {monthlyAnalysisData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val) => [`₹${val.toLocaleString('en-IN')}`]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 w-full md:w-1/3 px-4">
                  {monthlyAnalysisData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-bold text-slate-500">{item.name}</span>
                      </div>
                      <span className="text-sm font-extrabold text-slate-800">₹{item.value.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartWrapper>
          </div>

          <Goal
            financialSummary={{ income: finances.income, expenses: finances.expenses, savings: finances.savings }}
            loan={loan}
          />
        </div>
      </main>
    </div>
  );
};

const ChartWrapper = ({ title, children }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30">
    <div className="flex items-center justify-between mb-8">
      <h3 className="text-lg font-black tracking-tight">{title}</h3>
      <ArrowRight size={18} className="text-slate-300" />
    </div>
    {children}
  </div>
);

export default Dashboard;