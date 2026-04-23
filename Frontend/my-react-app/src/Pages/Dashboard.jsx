import React, { useState } from 'react';
import { Link } from "react-router-dom";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import {
  LayoutDashboard, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, 
  Menu, X, PieChart as PieIcon, ChevronRight, CheckCircle, 
  AlertCircle, Sparkles, Zap, Bell
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- MOCK DATA ---
  const trendData = [
    { name: 'Jan', income: 72000, expenses: 45000 },
    { name: 'Feb', income: 75000, expenses: 48000 },
    { name: 'Mar', income: 82000, expenses: 49000 },
    { name: 'Apr', income: 80000, expenses: 52000 },
    { name: 'May', income: 85000, expenses: 51200 },
  ];

  const pieData = [
    { name: 'Food', value: 12400, color: '#10b981' },
    { name: 'Transport', value: 6800, color: '#3b82f6' },
    { name: 'Utilities', value: 4200, color: '#f59e0b' },
    { name: 'Entertainment', value: 3600, color: '#6366f1' },
    { name: 'Others', value: 24200, color: '#94a3b8' },
  ];

  const budgetData = [
    { category: 'Housing', spent: 25000, limit: 25000 },
    { category: 'Food & Dining', spent: 12400, limit: 10000 },
    { category: 'Shopping', spent: 5000, limit: 8000 },
    { category: 'Transport', spent: 6800, limit: 7000 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden">
      
      {/* MESH BACKGROUND DECOR */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px]" />
      </div>

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">FV</div>
            <span className="text-xl font-black tracking-tight">FinanceView <span className="text-emerald-600">AI</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 font-semibold">
            <Link to="/" className="text-slate-500 hover:text-emerald-600 transition">Home</Link>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden cursor-pointer">
                <img src="https://ui-avatars.com/api/?name=User&background=10b981&color=fff" alt="avatar" />
            </div>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* WELCOME HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-sm">
                <Sparkles size={14} className="animate-pulse" />
                AI-Powered Insights Active
              </div>
              <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-2">
                Your Finances <span className="text-emerald-600 italic">at a Glance.</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium">Hello, welcome back to your financial command center.</p>
            </div>
            
            <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-emerald-600 transition-all hover:-translate-y-1">
              <Zap size={18} fill="currentColor" />
              Generate AI Report
            </button>
          </div>

          {/* TAB SYSTEM NAVIGATION */}
          <div className="inline-flex p-1.5 bg-slate-200/50 backdrop-blur-md rounded-[1.5rem] mb-10 border border-white/50 shadow-inner">
            {['Overview', 'Expenses', 'Budget'].map((tab, idx) => (
              <button
                key={tab}
                onClick={() => setActiveTab(idx)}
                className={`px-10 py-3 rounded-[1.2rem] text-sm font-black transition-all duration-300 ${
                  activeTab === idx 
                  ? 'bg-white text-emerald-600 shadow-lg' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* DASHBOARD CONTENT GRID */}
          <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* OVERVIEW TAB */}
            {activeTab === 0 && (
              <div className="space-y-8">
                {/* KPI ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <KPICard label="Monthly Income" value="₹85,000" chg="↑ 8.2%" isUp={true} icon={Wallet} />
                  <KPICard label="Total Expenses" value="₹51,200" chg="↓ 3.4%" isUp={false} icon={TrendingUp} />
                  <KPICard label="Net Savings" value="₹33,800" chg="↑ 12.1%" isUp={true} icon={CheckCircle} />
                  <KPICard label="Credit Score" value="745" chg="+22 pts" isUp={true} icon={Bell} />
                </div>

                {/* CHARTS SECTION */}
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 group bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black tracking-tight">Income vs Expenses</h3>
                        <select className="bg-slate-100 border-none rounded-xl text-xs font-bold px-4 py-2 outline-none">
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="h-[320px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                          <defs>
                            <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                          <Tooltip 
                             contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.8)'}}
                          />
                          <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorInc)" strokeWidth={4} />
                          <Area type="monotone" dataKey="expenses" stroke="#94a3b8" fill="transparent" strokeWidth={2} strokeDasharray="8 8" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-xl shadow-slate-200/40 flex flex-col">
                    <h3 className="text-xl font-black tracking-tight mb-8">Spending Breakdown</h3>
                    <div className="h-[280px] w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value">
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-slate-400 text-xs font-bold uppercase">Total Spent</span>
                        <span className="text-2xl font-black">₹51,200</span>
                      </div>
                    </div>
                    <div className="mt-auto space-y-3">
                        {pieData.slice(0, 3).map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}} />
                                    <span className="text-sm font-bold text-slate-600">{item.name}</span>
                                </div>
                                <span className="text-sm font-black">₹{item.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* EXPENSES TAB */}
            {activeTab === 1 && (
              <div className="grid lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl">
                  <h3 className="text-2xl font-black mb-8">Monthly Expense Categories</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={pieData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: '#f8fafc'}} />
                      <Bar dataKey="value" radius={[15, 15, 15, 15]} barSize={50}>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:rotate-12 transition-transform">
                        <Sparkles size={120} />
                    </div>
                    <h4 className="text-xl font-bold mb-4">AI Smart Tip</h4>
                    <p className="text-emerald-50 text-lg leading-relaxed mb-8">
                        "Your spending on <b>Food & Dining</b> is 15% higher than usual. Switching to home-cooked meals could save you ₹4,500 by next month."
                    </p>
                    <button className="w-full py-4 bg-white text-emerald-600 rounded-2xl font-black hover:bg-emerald-50 transition">
                        View Savings Plan
                    </button>
                </div>
              </div>
            )}

            {/* BUDGET TAB */}
            {activeTab === 2 && (
              <div className="max-w-4xl mx-auto w-full bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/50">
                <div className="text-center mb-16">
                    <h3 className="text-3xl font-black mb-2">Budget Allocation</h3>
                    <p className="text-slate-500 font-medium">Monitoring your limits against actual spending</p>
                </div>
                <div className="space-y-12">
                  {budgetData.map((item, i) => {
                    const isOver = item.spent > item.limit;
                    const percent = Math.min((item.spent / item.limit) * 100, 100);
                    return (
                      <div key={i} className="group">
                        <div className="flex justify-between items-end mb-4">
                          <div>
                            <span className="text-xs font-black text-emerald-600 uppercase tracking-tighter mb-1 block">Category</span>
                            <h4 className="text-2xl font-black text-slate-800 tracking-tight">{item.category}</h4>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400 font-bold">₹{item.spent.toLocaleString()} / <span className="text-slate-900">₹{item.limit.toLocaleString()}</span></span>
                            <div className={`flex items-center justify-end gap-1 text-xs font-black mt-1 ${isOver ? 'text-rose-500' : 'text-emerald-500'}`}>
                              {isOver ? <AlertCircle size={14}/> : <CheckCircle size={14}/>}
                              {isOver ? 'OVER LIMIT' : 'ON TRACK'}
                            </div>
                          </div>
                        </div>
                        <div className="h-5 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
                          <div 
                            className={`h-full transition-all duration-1000 ease-out rounded-full relative ${
                                isOver ? 'bg-gradient-to-r from-rose-500 to-orange-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            }`}
                            style={{ width: `${percent}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="relative z-10 text-center py-10 text-slate-400 font-bold border-t border-slate-200/50">
        © 2026 FinVue <span className="text-emerald-600">AI</span> COMMAND CENTER
      </footer>
    </div>
  );
};

/* PREMIUM KPI CARD COMPONENT */
const KPICard = ({ label, value, chg, isUp, icon: Icon }) => (
  <div className="group relative p-7 rounded-[2.2rem] bg-white/80 backdrop-blur-md border border-white shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
    <div className={`absolute -right-2 -top-2 w-20 h-20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isUp ? 'bg-emerald-100' : 'bg-rose-100'}`} />
    
    <div className="flex justify-between items-start mb-6 relative z-10">
      <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
        <Icon size={20} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-full ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {chg}
      </div>
    </div>
    
    <p className="text-sm font-bold text-slate-400 mb-1 relative z-10 uppercase tracking-tighter">{label}</p>
    <h4 className="text-3xl font-black text-slate-900 tracking-tighter relative z-10">{value}</h4>
  </div>
);

export default Dashboard;