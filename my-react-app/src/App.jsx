// import React, { useState } from 'react';
// import { 
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
// } from 'recharts';
// import { 
//   ShieldCheck, Wallet, PieChart, TrendingUp, Landmark, 
//   CheckCircle, ChevronRight, Menu, X, Bell, Download 
// } from 'lucide-react';

// const App = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   // Mock Data for Dashboard Preview
//   const data = [
//     { name: 'Jan', savings: 4000, expenses: 2400 },
//     { name: 'Feb', savings: 3000, expenses: 1398 },
//     { name: 'Mar', savings: 2000, expenses: 9800 },
//     { name: 'Apr', savings: 2780, expenses: 3908 },
//     { name: 'May', savings: 1890, expenses: 4800 },
//     { name: 'Jun', savings: 2390, expenses: 3800 },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100">
      
//       {/* --- NAVIGATION --- */}
//       <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">FV</div>
//             <span className="text-xl font-bold tracking-tight">FinanceView AI</span>
//           </div>
          
//           <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
//             <a href="#features" className="hover:text-emerald-600 transition">Features</a>
//             <a href="#how-it-works" className="hover:text-emerald-600 transition">How it Works</a>
//             <a href="#dashboard" className="hover:text-emerald-600 transition">Dashboard</a>
//             <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-emerald-600 transition shadow-lg shadow-emerald-900/10">
//               Check Eligibility
//             </button>
//           </div>

//           <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
//             {isMenuOpen ? <X /> : <Menu />}
//           </button>
//         </div>
//       </nav>

//       {/* --- HERO SECTION --- */}
//       <section className="pt-32 pb-20 px-6">
//         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
//           <div>
//             <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
//               <span className="relative flex h-2 w-2">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
//               </span>
//               AI-Powered Financial Clarity
//             </div>
//             <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
//               Understand Your Finances. <span className="text-emerald-600">Decide</span> Smarter.
//             </h1>
//             <p className="text-lg text-slate-600 mb-8 max-w-lg">
//               The first financial manager that connects your daily spending habits with your long-term loan eligibility. Track, plan, and borrow smarter.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4">
//               <button className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-200">
//                 Get Started Free <ChevronRight size={20} />
//               </button>
//               <button className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition">
//                 View Live Demo
//               </button>
//             </div>
//           </div>
          
//           <div className="relative">
//             <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl rounded-full"></div>
//             <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 relative overflow-hidden">
//                 <div className="flex justify-between items-end mb-6">
//                     <div>
//                         <p className="text-slate-400 text-sm">Monthly Savings</p>
//                         <h3 className="text-3xl font-bold">$12,450.00</h3>
//                     </div>
//                     <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg text-sm font-bold">+14%</div>
//                 </div>
//                 <div className="h-[250px] w-full">
//                     <ResponsiveContainer width="100%" height="100%">
//                         <AreaChart data={data}>
//                             <defs>
//                                 <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
//                                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
//                                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
//                                 </linearGradient>
//                             </defs>
//                             <Area type="monotone" dataKey="savings" stroke="#10b981" fillOpacity={1} fill="url(#colorSavings)" strokeWidth={3} />
//                         </AreaChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* --- PROBLEM & SOLUTION --- */}
//       <section className="py-24 bg-slate-900 text-white overflow-hidden">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="grid lg:grid-cols-2 gap-20 items-center">
//             <div className="space-y-8">
//               <h2 className="text-4xl font-bold">Why typical finance apps fail you.</h2>
//               <div className="space-y-6">
//                 {[
//                     { t: "Fragmented Data", d: "Standard apps show you spending but don't tell you if you're ready for a mortgage." },
//                     { t: "Static Calculators", d: "Loan tools use generic math, ignoring your actual savings behavior and history." },
//                     { t: "No Guidance", d: "Visualization is useless without interpretation and actionable advice." }
//                 ].map((item, i) => (
//                     <div key={i} className="flex gap-4">
//                         <div className="mt-1 text-emerald-500"><X size={24} /></div>
//                         <div>
//                             <h4 className="font-bold text-xl">{item.t}</h4>
//                             <p className="text-slate-400">{item.d}</p>
//                         </div>
//                     </div>
//                 ))}
//               </div>
//             </div>
//             <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
//                 <h3 className="text-2xl font-bold mb-6 text-emerald-400">The FinVue Solution</h3>
//                 <div className="grid gap-4">
//                     <div className="p-4 bg-slate-700/50 rounded-xl flex items-center gap-4">
//                         <CheckCircle className="text-emerald-500" />
//                         <span>Unified Financial Identity Engine</span>
//                     </div>
//                     <div className="p-4 bg-slate-700/50 rounded-xl flex items-center gap-4">
//                         <CheckCircle className="text-emerald-500" />
//                         <span>Predictive Loan Readiness Scoring</span>
//                     </div>
//                     <div className="p-4 bg-slate-700/50 rounded-xl flex items-center gap-4">
//                         <CheckCircle className="text-emerald-500" />
//                         <span>Behavior-based Budget Optimization</span>
//                     </div>
//                 </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* --- FEATURES SECTION --- */}
//       <section id="features" className="py-24 px-6">
//         <div className="max-w-7xl mx-auto">
//             <div className="text-center mb-16">
//                 <h2 className="text-4xl font-bold mb-4">Powerful Tools for Wealth Building</h2>
//                 <p className="text-slate-500 max-w-2xl mx-auto">Everything you need to transition from passive tracking to active wealth management.</p>
//             </div>
//             <div className="grid md:grid-cols-3 gap-8">
//                 <FeatureCard 
//                     icon={<Landmark className="text-emerald-600" />}
//                     title="AI Loan Predictor"
//                     desc="Get an instant probability score for loan approvals using our proprietary behavioral risk model."
//                 />
//                 <FeatureCard 
//                     icon={<TrendingUp className="text-emerald-600" />}
//                     title="Credit Growth Insights"
//                     desc="Don't just watch your score. Receive tailored tasks to improve your standing in weeks."
//                 />
//                 <FeatureCard 
//                     icon={<Wallet className="text-emerald-600" />}
//                     title="Smart Expense Tracker"
//                     desc="Automatic categorization and anomaly detection to stop subscription leaks."
//                 />
//             </div>
//         </div>
//       </section>

//       {/* --- LOAN PREDICTOR TOOL (FORM) --- */}
//       <section id="how-it-works" className="py-24 bg-emerald-50 px-6">
//         <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-emerald-100">
//             <div className="text-center mb-10">
//                 <h2 className="text-3xl font-bold mb-2">Check Your Eligibility</h2>
//                 <p className="text-slate-500">Fast, secure, and doesn't affect your credit score.</p>
//             </div>
//             <form className="grid md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                     <label className="text-sm font-semibold text-slate-700">Monthly Income ($)</label>
//                     <input type="number" placeholder="5,000" className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition" />
//                 </div>
//                 <div className="space-y-2">
//                     <label className="text-sm font-semibold text-slate-700">Existing Monthly Debts ($)</label>
//                     <input type="number" placeholder="400" className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition" />
//                 </div>
//                 <div className="space-y-2">
//                     <label className="text-sm font-semibold text-slate-700">Credit Score (Estimate)</label>
//                     <select className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition">
//                         <option>300-580 (Poor)</option>
//                         <option>581-670 (Fair)</option>
//                         <option selected>671-740 (Good)</option>
//                         <option>741-850 (Excellent)</option>
//                     </select>
//                 </div>
//                 <div className="space-y-2">
//                     <label className="text-sm font-semibold text-slate-700">Employment Status</label>
//                     <select className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition">
//                         <option>Salaried</option>
//                         <option>Self-Employed</option>
//                         <option>Student</option>
//                     </select>
//                 </div>
//                 <div className="md:col-span-2 mt-4">
//                     <button type="button" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg">
//                         Calculate Approval Odds
//                     </button>
//                 </div>
//             </form>
//         </div>
//       </section>

//       {/* --- SECURITY SECTION --- */}
//       <section className="py-20 px-6 bg-white border-y border-slate-100">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
//             <div className="flex-1">
//                 <ShieldCheck size={80} className="text-emerald-500 mb-6" />
//                 <h2 className="text-4xl font-bold mb-4">Bank-Grade Security. Always.</h2>
//                 <p className="text-lg text-slate-600">We use 256-bit AES encryption and multi-factor authentication to ensure your financial data remains your own. We never sell your data to third parties.</p>
//             </div>
//             <div className="flex-1 grid grid-cols-2 gap-4">
//                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center font-bold">GDPR Compliant</div>
//                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center font-bold">SSL Encrypted</div>
//                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center font-bold">ISO 27001 Certified</div>
//                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center font-bold">2FA Enabled</div>
//             </div>
//         </div>
//       </section>

//       {/* --- FOOTER --- */}
//       <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200 px-6">
//         <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
//             <div className="col-span-1 md:col-span-1">
//                 <div className="flex items-center gap-2 mb-6">
//                     <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">FV</div>
//                     <span className="text-lg font-bold">FinVue AI</span>
//                 </div>
//                 <p className="text-slate-500 text-sm">Empowering financial freedom through intelligent analytics and predictive modeling.</p>
//             </div>
//             <div>
//                 <h4 className="font-bold mb-6">Product</h4>
//                 <ul className="space-y-4 text-sm text-slate-600">
//                     <li><a href="#" className="hover:text-emerald-600">Loan Predictor</a></li>
//                     <li><a href="#" className="hover:text-emerald-600">Expense Tracker</a></li>
//                     <li><a href="#" className="hover:text-emerald-600">Budget Planner</a></li>
//                 </ul>
//             </div>
//             <div>
//                 <h4 className="font-bold mb-6">Company</h4>
//                 <ul className="space-y-4 text-sm text-slate-600">
//                     <li><a href="#" className="hover:text-emerald-600">Privacy Policy</a></li>
//                     <li><a href="#" className="hover:text-emerald-600">Terms of Service</a></li>
//                     <li><a href="#" className="hover:text-emerald-600">Contact Us</a></li>
//                 </ul>
//             </div>
//             <div>
//                 <h4 className="font-bold mb-6">Newsletter</h4>
//                 <div className="flex gap-2">
//                     <input type="text" placeholder="Email" className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm w-full outline-none focus:ring-1 focus:ring-emerald-500" />
//                     <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold">Join</button>
//                 </div>
//             </div>
//         </div>
//         <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
//             © 2026 FinVue AI. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// };

// const FeatureCard = ({ icon, title, desc }) => (
//     <div className="p-8 rounded-3xl bg-white border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition duration-300">
//         <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
//             {icon}
//         </div>
//         <h3 className="text-xl font-bold mb-3">{title}</h3>
//         <p className="text-slate-500 leading-relaxed">{desc}</p>
//     </div>
// );

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home/Home";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;