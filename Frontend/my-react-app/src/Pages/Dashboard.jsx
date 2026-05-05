import React, { useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import {
  LayoutDashboard, TrendingUp, Wallet, CheckCircle, Sparkles, Zap, Edit3, Save, Plus, ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  const [isEditing, setIsEditing] = useState(true);

  // --- USER INPUT STATE ---
  const [finances, setFinances] = useState({
    income: 0,
    expenses: 0,
    savings: 0,
    creditScore: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    
    setFinances(prev => {
      const updated = { ...prev, [name]: numValue };
      if (name === 'income' || name === 'expenses') {
        updated.savings = updated.income - updated.expenses;
      }
      return updated;
    });
  };

  // --- DYNAMIC DATA GENERATION ---
  const trendData = [
    { name: 'Mar', income: finances.income * 0.7, expenses: finances.expenses * 0.85 },
    { name: 'Apr', income: finances.income * 0.85, expenses: finances.expenses * 0.8 },
    { name: 'May', income: finances.income, expenses: finances.expenses },
  ];

  const pieData = finances.income === 0 && finances.expenses === 0 
    ? [{ name: 'No Data', value: 1, color: '#e2e8f0' }] 
    : [
        { name: 'Expenses', value: finances.expenses, color: '#f43f5e' },
        { name: 'Savings', value: finances.savings > 0 ? finances.savings : 0, color: '#10b981' },
      ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden">
      
      {/* BACKGROUND ACCENTS */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-emerald-200/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-200/20 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
              <h2 className="text-4xl font-black tracking-tight mb-1">Financial <span className="text-emerald-600">Workspace</span></h2>
              <p className="text-slate-500 font-medium">Visualizing your personal economy in real-time.</p>
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-emerald-600 transition-all"
            >
              {isEditing ? <><Save size={18} /> Finish Editing</> : <><Edit3 size={18} /> Update Numbers</>}
            </button>
          </div>

          {/* INPUT FIELDS */}
          {isEditing && (
            <div className="mb-10 p-8 bg-white rounded-[2.5rem] border border-emerald-100 shadow-2xl shadow-emerald-100/50 animate-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <InputGroup label="Monthly Income" name="income" value={finances.income} onChange={handleInputChange} />
                <InputGroup label="Monthly Expenses" name="expenses" value={finances.expenses} onChange={handleInputChange} />
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Auto-Savings</label>
                  <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-xl border border-emerald-100">
                    ₹{finances.savings.toLocaleString()}
                  </div>
                </div>
                <InputGroup label="Credit Score" name="creditScore" value={finances.creditScore} onChange={handleInputChange} />
              </div>
            </div>
          )}

          {/* TOP KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <KPISmall label="Income" val={finances.income} icon={Wallet} color="text-emerald-600" />
            <KPISmall label="Expenses" val={finances.expenses} icon={TrendingUp} color="text-rose-500" />
            <KPISmall label="Net Balance" val={finances.savings} icon={CheckCircle} color="text-blue-600" />
            <KPISmall label="Credit Health" val={finances.creditScore} icon={Sparkles} color="text-amber-500" isCurrency={false} />
          </div>

          {/* GRAPHS GRID */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* AREA CHART: CASH FLOW */}
            <ChartWrapper title="Cash Flow Overview">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700}} />
                  <YAxis hide />
                  <Tooltip contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={3} fill="transparent" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartWrapper>

            {/* LINE CHART: EXPENSE STABILITY */}
            <ChartWrapper title="Expense Stability Tracking">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700}} />
                  <YAxis hide />
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontWeight: 'bold'}} />
                  <Line type="stepAfter" dataKey="expenses" name="Spending Level" stroke="#6366f1" strokeWidth={4} dot={{r: 6, fill: '#6366f1'}} />
                  <Line type="monotone" dataKey="income" name="Income Floor" stroke="#cbd5e1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          {/* BOTTOM PIE SECTION */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/3">
              <h3 className="text-2xl font-black mb-4 leading-tight">Savings <br/>Composition</h3>
              <p className="text-slate-500 font-medium mb-6 text-sm">This shows the ratio of your monthly spending vs. what you retain as net savings.</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <span className="text-xs font-bold text-slate-500">Efficiency Score</span>
                  <span className="text-lg font-black text-emerald-600">{finances.income > 0 ? Math.round((finances.savings / finances.income) * 100) : 0}%</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={80} outerRadius={110} paddingAngle={10} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- MINI COMPONENTS --- */

const InputGroup = ({ label, name, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input 
      type="number" 
      name={name}
      value={value === 0 ? '' : value}
      onChange={onChange}
      placeholder="0"
      className="p-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none font-black text-lg transition-all"
    />
  </div>
);

const KPISmall = ({ label, val, icon: Icon, color, isCurrency = true }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center ${color}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</p>
      <h4 className="text-lg font-black">{isCurrency ? '₹' : ''}{val.toLocaleString()}</h4>
    </div>
  </div>
);

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