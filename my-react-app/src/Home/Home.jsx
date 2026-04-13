import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  ShieldCheck, Wallet, PieChart, TrendingUp, Landmark, 
  CheckCircle, ChevronRight, Menu, X, Bell, Download 
} from 'lucide-react';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const data = [
    { name: 'Jan', savings: 4000, expenses: 2400 },
    { name: 'Feb', savings: 3000, expenses: 1398 },
    { name: 'Mar', savings: 2000, expenses: 9800 },
    { name: 'Apr', savings: 2780, expenses: 3908 },
    { name: 'May', savings: 1890, expenses: 4800 },
    { name: 'Jun', savings: 2390, expenses: 3800 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100">
      
      {/* NAVIGATION */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">FV</div>
            <span className="text-xl font-bold tracking-tight">FinanceView AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <a href="#features" className="hover:text-emerald-600 transition">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition">How it Works</a>
            {/* <a href="#dashboard" className="hover:text-emerald-600 transition">Dashboard</a> */}

            {/* <Link to="/login"> */}
            <Link>
             <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-emerald-600 transition shadow-lg shadow-emerald-900/10">
                Check Eligibility
              </button>
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t px-6 py-4 flex flex-col gap-4">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              AI-Powered Financial Clarity
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
              Understand Your Finances. <span className="text-emerald-600">Decide</span> Smarter.
            </h1>

            <p className="text-lg text-slate-600 mb-8 max-w-lg">
              The first financial manager that connects your daily spending habits with your long-term loan eligibility.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login">
                <button className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2">
                  Get Started Free <ChevronRight size={20} />
                </button>
              </Link>

              <Link to="/dashboard">
                <button className="bg-white border px-8 py-4 rounded-2xl font-bold">
                  View Dashboard
                </button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Savings</h3>
              <div className="h-[250px]">
                <ResponsiveContainer>
                  <AreaChart data={data}>
                    <Area dataKey="savings" stroke="#10b981" fill="#10b981" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

          <FeatureCard icon={<Landmark />} title="AI Loan Predictor" desc="Get approval prediction" />
          <FeatureCard icon={<TrendingUp />} title="Credit Insights" desc="Improve credit score" />
          <FeatureCard icon={<Wallet />} title="Expense Tracker" desc="Track expenses" />

        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 border-t">
        © 2026 FinVue AI
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 rounded-3xl bg-white shadow hover:shadow-xl transition">
    <div className="mb-4">{icon}</div>
    <h3 className="font-bold mb-2">{title}</h3>
    <p className="text-slate-500">{desc}</p>
  </div>
);

export default Home;