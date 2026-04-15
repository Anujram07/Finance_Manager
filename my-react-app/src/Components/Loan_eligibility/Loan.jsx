import React, { useState } from "react";

const Loan = () => {
  const [form, setForm] = useState({
    income: "",
    expenses: "",
    emis: "",
    credit: "",
    loanAmt: "",
    tenure: "",
    empType: "",
    expYears: ""
  });

  const [result, setResult] = useState({
    probability: 0,
    eligibleAmount: 0,
    emi: 0,
    tips: [],
    calculated: false
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const runPredictor = () => {
    const income = Number(form.income) || 0;
    const expenses = Number(form.expenses) || 0;
    const emis = Number(form.emis) || 0;
    const credit = Number(form.credit) || 0;
    const loanAmt = Number(form.loanAmt) || 0;
    const tenure = Number(form.tenure) || 1;

    if (income <= 0 || credit <= 0) {
      alert("Please enter valid Income and Credit Score");
      return;
    }

    const disposableIncome = income - expenses - emis;
    const dti = income ? ((emis + expenses) / income) * 100 : 0;
    const incomeStrength = Math.min((disposableIncome / income) * 100, 100);
    const creditScore = (credit / 900) * 100;
    const repayCapacity = loanAmt ? Math.min((disposableIncome / (loanAmt / tenure)) * 10, 100) : 0;

    let probability = (incomeStrength * 0.3 + (100 - dti) * 0.3 + creditScore * 0.2 + repayCapacity * 0.2);
    probability = Math.max(10, Math.min(95, probability));

    const eligibleAmount = Math.max(0, disposableIncome * 20);
    const emi = loanAmt && tenure ? Math.round(loanAmt / tenure) : 0;

    const tips = [];
    if (credit < 650) tips.push("Improve your credit score");
    if (dti > 50) tips.push("Reduce your expenses or EMIs");
    if (disposableIncome < 20000) tips.push("Increase income or reduce spending");
    if (tips.length === 0) tips.push("Great! You are financially healthy 🎉");

    setResult({
      probability: Math.round(probability),
      eligibleAmount,
      emi,
      tips,
      calculated: true
    });
  };

  // Helper for dynamic colors
  const getScoreColor = (prob) => {
    if (prob > 70) return "text-emerald-500 border-emerald-500";
    if (prob > 40) return "text-amber-500 border-amber-500";
    return "text-rose-500 border-rose-500";
  };

  return (
    <section className="py-20 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="px-4 py-1.5 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-100 rounded-full">
            Financial Intelligence
          </span>
          <h2 className="mt-4 text-4xl font-extrabold text-slate-900">
            AI Loan Eligibility Predictor
          </h2>
          <p className="mt-2 text-slate-500">
            Check your borrowing power instantly using our advanced AI modeling.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* FORM CARD */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
              Financial Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Monthly Income</label>
                <input type="number" id="income" onChange={handleChange} placeholder="e.g. 50000" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Monthly Expenses</label>
                <input type="number" id="expenses" onChange={handleChange} placeholder="e.g. 15000" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Current EMIs</label>
                <input type="number" id="emis" onChange={handleChange} placeholder="e.g. 5000" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Credit Score</label>
                <input type="number" id="credit" onChange={handleChange} placeholder="300-900" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Desired Loan Amount</label>
                <input type="number" id="loanAmt" onChange={handleChange} placeholder="e.g. 500000" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Tenure (Months)</label>
                <input type="number" id="tenure" onChange={handleChange} placeholder="e.g. 24" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>
            </div>

            <button
              onClick={runPredictor}
              className="mt-8 w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all duration-300 transform hover:-translate-y-1"
            >
              Analyze Eligibility
            </button>
          </div>

          {/* RESULT CARD */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`bg-white p-8 rounded-3xl shadow-xl border border-slate-100 transition-all duration-500 ${result.calculated ? 'opacity-100' : 'opacity-60'}`}>
              <h3 className="text-center text-slate-500 font-medium uppercase tracking-widest text-sm mb-6">Probability Score</h3>
              
              {/* Circular Chart Placeholder */}
              {/* Circular Chart */}
<div className="relative flex items-center justify-center mb-8">
  <svg className="w-40 h-40 transform -rotate-90">
    {/* Background Circle (Gray Track) */}
    <circle
      cx="80"
      cy="80"
      r="70"
      stroke="currentColor"
      strokeWidth="12"
      fill="transparent"
      className="text-slate-100"
    />
    {/* Progress Circle (The "Chart") */}
    <circle
      cx="80"
      cy="80"
      r="70"
      stroke="currentColor"
      strokeWidth="12"
      fill="transparent"
      strokeDasharray={440} // Circumference: 2 * Math.PI * 70
      strokeDashoffset={440 - (440 * result.probability) / 100}
      strokeLinecap="round"
      className={`transition-all duration-1000 ease-out ${getScoreColor(result.probability)}`}
    />
  </svg>
  
  {/* Percentage Text in Center */}
  <div className="absolute flex flex-col items-center">
    <span className="text-4xl font-black text-slate-800">
      {result.probability}%
    </span>
    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
      Probability
    </span>
  </div>
</div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                  <span className="text-slate-500 font-medium">Eligible Amount</span>
                  <span className="text-slate-900 font-bold text-lg">₹{result.eligibleAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                  <span className="text-slate-500 font-medium">Estimated EMI</span>
                  <span className="text-slate-900 font-bold text-lg">₹{result.emi.toLocaleString()}</span>
                </div>
              </div>

              {result.calculated && (
                <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-blue-800 font-bold text-sm mb-2 uppercase tracking-wide">AI Recommendations:</p>
                  <ul className="space-y-2">
                    {result.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-blue-700">
                        <span className="mt-1 w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Loan;