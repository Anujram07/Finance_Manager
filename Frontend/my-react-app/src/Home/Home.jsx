import React, { useState } from 'react';
import { Link } from "react-router-dom";
import {
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  ShieldCheck, Wallet, PieChart, TrendingUp, Landmark,
  CheckCircle, ChevronRight, Menu, X
} from 'lucide-react';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const data = [
    { name: 'Jan', savings: 4000 },
    { name: 'Feb', savings: 3000 },
    { name: 'Mar', savings: 2000 },
    { name: 'Apr', savings: 2780 },
    { name: 'May', savings: 1890 },
    { name: 'Jun', savings: 2390 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">FV</div>
            <span className="text-xl font-bold">FinanceView AI</span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <a href="#features" className="hover:text-emerald-600">Features</a>
            <a href="#how" className="hover:text-emerald-600">How it Works</a>

            <Link to="/loan">
              <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-emerald-600 transition">
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
            <div className="inline-flex items-center bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm mb-6">
              AI-Powered Financial Clarity
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Understand Your Finances. <span className="text-emerald-600">Decide</span> Smarter.
            </h1>

            <p className="text-lg text-slate-600 mb-8">
              Track your finances and check loan eligibility using AI-powered insights.
            </p>

            <div className="flex gap-4">
              <Link to="/login">
                <button className="bg-emerald-600 text-white px-8 py-4 rounded-2xl flex items-center gap-2">
                  Get Started <ChevronRight />
                </button>
              </Link>

              <Link to="/dashboard">
                <button className="bg-white border px-8 py-4 rounded-2xl">
                  View Dashboard
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
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
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Financial Tools</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Everything you need to manage and grow your finances.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            <FeatureCard icon={<Landmark />} title="Loan Predictor" desc="AI predicts loan approval." />
            <FeatureCard icon={<TrendingUp />} title="Credit Insights" desc="Improve your credit score." />
            <FeatureCard icon={<Wallet />} title="Expense Tracker" desc="Track spending easily." />
            <FeatureCard icon={<ShieldCheck />} title="Fraud Detection" desc="Stay safe from scams." />
            <FeatureCard icon={<PieChart />} title="Budget Planner" desc="Manage your finances." />
            <FeatureCard icon={<CheckCircle />} title="Loan Simulator" desc="Test loan scenarios." />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-slate-50 py-16 px-6 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              From Raw Data to Smart Decisions in Minutes
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Four simple steps that transform your financial data into clear insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StepCard step="1" title="Enter Profile" desc="Add income & expenses." />
            <StepCard step="2" title="AI Analysis" desc="System evaluates your data." />
            <StepCard step="3" title="Get Insights" desc="See loan eligibility instantly." />
            <StepCard step="4" title="Improve" desc="Follow smart recommendations." />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 border-t">
        © 2026 FinVue AI
      </footer>

    </div>
  );
};

/* FEATURE CARD */
const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 rounded-3xl bg-white shadow hover:shadow-xl transition">
    <div className="mb-4 text-emerald-600">{icon}</div>
    <h3 className="font-bold mb-2">{title}</h3>
    <p className="text-slate-500">{desc}</p>
  </div>
);

/* STEP CARD */
const StepCard = ({ step, title, desc }) => (
  <div className="p-8 rounded-3xl bg-white shadow hover:shadow-xl transition">
    <div className="text-blue-600 text-3xl font-bold mb-4">{step}</div>
    <h3 className="font-bold mb-2">{title}</h3>
    <p className="text-slate-500">{desc}</p>
  </div>
);

export default Home;