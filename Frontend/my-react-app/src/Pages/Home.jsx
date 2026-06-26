import React from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { ArrowRight, TrendingUp, Sparkles } from 'lucide-react';

const data = [
  { month: 'Jan', savings: 4000 },
  { month: 'Feb', savings: 3200 },
  { month: 'Mar', savings: 5500 },
  { month: 'Apr', savings: 4800 },
  { month: 'May', savings: 7200 },
  { month: 'Jun', savings: 6800 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6">
        {/* Background Decorative Accents */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/40 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-100/40 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase">
              <Sparkles size={14} />
              AI-Powered Financial Clarity
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight">
              Take Control of <br/>Your <span className="text-emerald-600">Future.</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-medium">
              Join thousands of users who use FinanceView to visualize their economy, optimize spending, and reach their financial goals faster.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200">
                Start Your Journey <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                See How It Works
              </button>
            </div>
          </div>

          {/* Featured Marketing Graph Card */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500 to-blue-400 rounded-[3rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
            <div className="relative bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Projection</p>
                  <h3 className="font-black text-slate-900 text-2xl tracking-tight">Growth Trajectory</h3>
                </div>
                <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                  <TrendingUp size={28} />
                </div>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="homeGraphGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} 
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{
                        borderRadius: '24px', 
                        border: 'none', 
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                        padding: '16px 20px',
                        fontWeight: 'bold'
                      }}
                      cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="savings" 
                      stroke="#10b981" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#homeGraphGradient)" 
                      animationDuration={2500}
                      dot={{ r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }}
                      activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                <div className="flex gap-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Avg. Monthly</p>
                    <p className="text-xl font-black text-slate-900">₹5,250</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Net Yield</p>
                    <p className="text-xl font-black text-emerald-600">+18.4%</p>
                  </div>
                </div>
                <div className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors cursor-pointer shadow-lg">
                  View Details
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
