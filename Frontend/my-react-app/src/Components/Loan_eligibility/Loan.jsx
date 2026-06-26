import React, { useEffect, useState } from "react";

const Loan = () => {
  const [form, setForm] = useState({
    age: "",
    empType: "employed", // options: employed, self-employed, unemployed, student, retired
    workExperience: "", // Years of employment or work
    income: "", // Monthly income
    credit: "", // Credit score
    currentDebt: "", // Total unpaid bills, existing EMIs, borrowed amount (up to 12 months sum)
    loanPurpose: "personal", // options: home, education, business, personal, health, debt-obligations
    loanAmt: "", // Loan amount
    interestRate: "", // Manually entered interest rate (percentage e.g. 10.5)
    tenure: "" // Tenure in months
  });

  const [result, setResult] = useState({
    probability: 0,
    eligibleAmount: 0,
    emi: 0,
    tips: [],
    calculated: false
  });

  useEffect(() => {
    if (result.calculated) {
      localStorage.setItem('loanEligibilityData', JSON.stringify(result));
    }
  }, [result]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const saveLoanData = async (payload) => {
    try {
      const response = await fetch("http://localhost:5000/api/data/loan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save loan data");
      }
      console.log("Loan data saved:", data);
    } catch (error) {
      console.error("Error saving loan data:", error.message);
      alert("Loan assessment was calculated, but saving to MongoDB failed.");
    }
  };

  const runPredictor = () => {
    const age = Number(form.age) || 0;
    const workExperience = Number(form.workExperience) || 0;
    const income = Number(form.income) || 0;
    const credit = Number(form.credit) || 0;
    const currentDebt = Number(form.currentDebt) || 0;
    const loanAmt = Number(form.loanAmt) || 0;
    const inputRate = Number(form.interestRate) || 0;
    const tenure = Number(form.tenure) || 1;

    // --- BASIC VALIDATIONS ---
    if (income <= 0 || credit < 300 || credit > 900) {
      alert("Please enter a valid monthly income and a credit score between 300 and 900.");
      return;
    }
    if (age < 18 || age > 75) {
      alert("Age must be between 18 and 75 for standard risk assessment.");
      return;
    }
    if (inputRate <= 0 || inputRate > 100) {
      alert("Please enter a valid annual interest rate percentage (e.g., 10.5).");
      return;
    }
    if (loanAmt <= 0 || tenure <= 0) {
      alert("Please enter a valid loan amount and tenure.");
      return;
    }

    // --- FINANCIAL METRICS CORRECTIONS ---
    // 1. Amortize the 12-month aggregated debt footprint to find the true monthly burden
    const monthlyDebtOverhead = currentDebt / 12;
    const foir = (monthlyDebtOverhead / income) * 100;
    const disposableIncome = income - monthlyDebtOverhead;

    // 2. Convert annual percentage (e.g., 10.5) to a monthly fractional rate
    const annualRateFraction = inputRate / 100;
    const monthlyRate = annualRateFraction / 12;
    
    // 3. Precise EMI Calculation
    let calculatedEmi = 0;
    if (monthlyRate > 0) {
      calculatedEmi = (loanAmt * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                      (Math.pow(1 + monthlyRate, tenure) - 1);
    } else {
      calculatedEmi = loanAmt / tenure;
    }

    // 4. Maximum Allowed New EMI (Capped strictly at 50% of income minus recurring debt liabilities)
    const maxAllowedNewEmi = Math.max(0, (income * 0.5) - monthlyDebtOverhead); 
    
    // 5. Maximum Loan Eligibility Calculation based on free cash capacity
    let eligibleAmount = 0;
    if (maxAllowedNewEmi > 0 && monthlyRate > 0) {
      eligibleAmount = (maxAllowedNewEmi * (Math.pow(1 + monthlyRate, tenure) - 1)) / 
                       (monthlyRate * Math.pow(1 + monthlyRate, tenure));
    } else if (maxAllowedNewEmi > 0) {
      eligibleAmount = maxAllowedNewEmi * tenure;
    }

    // --- ALGOMETER SCORING SYSTEM (Max 100 Points) ---
    let creditScoreWeight = 0;      // Max 35 points
    let debtBurdenWeight = 0;       // Max 25 points
    let emiAffordabilityWeight = 0; // Max 25 points
    let profileWeight = 0;          // Max 15 points

    // 1. Credit Score Matrix
    if (credit >= 750) creditScoreWeight = 35;
    else if (credit >= 700) creditScoreWeight = 28;
    else if (credit >= 650) creditScoreWeight = 18;
    else if (credit >= 580) creditScoreWeight = 8;
    else creditScoreWeight = 0;

    // 2. Existing Debt Footprint Weighting (FOIR)
    if (foir <= 20) debtBurdenWeight = 25;
    else if (foir <= 40) debtBurdenWeight = 18;
    else if (foir <= 55) debtBurdenWeight = 10;
    else debtBurdenWeight = 0;

    // 3. Prospective New Liability Burden Matrix
    const prospectiveFoir = ((monthlyDebtOverhead + calculatedEmi) / income) * 100;
    if (prospectiveFoir <= 40) emiAffordabilityWeight = 25;
    else if (prospectiveFoir <= 55) emiAffordabilityWeight = 15;
    else if (prospectiveFoir <= 65) emiAffordabilityWeight = 5;
    else emiAffordabilityWeight = 0;

    // 4. Profile Longevity Weights
    if (form.empType === "employed") profileWeight += 6;
    else if (form.empType === "self-employed") profileWeight += 4;
    else if (form.empType === "retired") profileWeight += 3;

    if (workExperience >= 5) profileWeight += 5;
    else if (workExperience >= 2) profileWeight += 3;
    else if (workExperience > 0) profileWeight += 1;

    if (age >= 25 && age <= 58) profileWeight += 4;
    else if (age >= 18) profileWeight += 2;

    // Accumulate base matrix mathematical sum
    let probability = creditScoreWeight + debtBurdenWeight + emiAffordabilityWeight + profileWeight;
    
    // --- INTELLIGENT KNOCKOUT AND OVERRIDE LAWS ---
    // A student is explicitly exempted from high-risk failure if they apply for an education loan.
    const isStudentExempt = form.empType === "student" && form.loanPurpose === "education";
    const isHardRejected = credit < 520 || prospectiveFoir > 75 || (form.empType === "unemployed") || (form.empType === "student" && !isStudentExempt);

    if (isHardRejected) {
      probability = Math.min(probability, 12); // Reduce to minimum approval floor bound
    }
    
    // Bounds control protection
    probability = Math.max(5, Math.min(98, probability));

    // --- CONTEXTUAL SMART ENGINE RECOMMENDATIONS ---
    const tips = [];
    if (credit < 750) tips.push("Focus on increasing your credit score over 750 by paying balances on time and keeping credit utilization low.");
    if (foir > 45) tips.push("Your 12-month accumulated liabilities reflect a significant recurring monthly cash-flow strain.");
    if (calculatedEmi > disposableIncome) tips.push("The projected monthly installment safely outpaces your current real disposable net income pool.");
    if (loanAmt > eligibleAmount && eligibleAmount > 0) tips.push(`Consider matching your financing target closer to your safe threshold limit of ₹${Math.round(eligibleAmount).toLocaleString()}.`);
    
    if (form.empType === "student" && form.loanPurpose === "education") {
      tips.push("Student profiles processing explicit student loans show higher approval tracks when backed by a stable co-borrower/guardian.");
    } else if (form.empType === "student" || form.empType === "unemployed") {
      tips.push("Unemployed status or standard student profiling requires collateral or guaranteed asset placement pathways for approval.");
    }
    
    if (tips.length === 0) tips.push("Excellent data parameters. Your profile configuration matches low risk-category tiers perfectly! 🚀");

    const finalResult = {
      probability: Math.round(probability),
      eligibleAmount: Math.round(eligibleAmount),
      emi: Math.round(calculatedEmi),
      tips,
      calculated: true
    };

    setResult(finalResult);

    saveLoanData({
      ...form,
      age: Number(form.age),
      workExperience: Number(form.workExperience),
      income: Number(form.income),
      credit: Number(form.credit),
      currentDebt: Number(form.currentDebt),
      loanAmt: Number(form.loanAmt),
      interestRate: Number(form.interestRate),
      tenure: Number(form.tenure),
      result: finalResult
    });
  };

  const getScoreColor = (prob) => {
    if (prob > 75) return "text-emerald-500 border-emerald-500";
    if (prob > 50) return "text-amber-500 border-amber-500";
    return "text-rose-500 border-rose-500";
  };

  return (
    <section className="py-20 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="px-4 py-1.5 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-100 rounded-full">
            Financial Risk Analytics
          </span>
          <h2 className="mt-4 text-4xl font-extrabold text-slate-900">
            Advanced Loan Eligibility Predictor
          </h2>
          <p className="mt-2 text-slate-500">
            Evaluate true borrowing parameters safely using updated bank risk-assessment algorithms.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* FORM CARD */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
              Applicant Financial Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Age</label>
                <input type="number" id="age" value={form.age} onChange={handleChange} placeholder="e.g. 30" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Occupation Status</label>
                <select id="empType" value={form.empType} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition">
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="student">Student</option>
                  <option value="retired">Retired</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Years of Employment / Work</label>
                <input type="number" id="workExperience" value={form.workExperience} onChange={handleChange} placeholder="e.g. 4" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Monthly Net Income</label>
                <input type="number" id="income" value={form.income} onChange={handleChange} placeholder="e.g. 50000" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Credit Score (CIBIL)</label>
                <input type="number" id="credit" value={form.credit} onChange={handleChange} placeholder="300-900" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>

              <div className="space-y-2">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-600">Current Aggregated Debt</label>
                  <span className="text-[10px] text-slate-400 font-medium leading-tight">Sum total of unpaid bills, existing EMIs & loans (&le; 12 months)</span>
                </div>
                <input type="number" id="currentDebt" value={form.currentDebt} onChange={handleChange} placeholder="e.g. 60000" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Loan Type</label>
                <select id="loanPurpose" value={form.loanPurpose} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition">
                  <option value="home">Home</option>
                  <option value="education">Education</option>
                  <option value="business">Business</option>
                  <option value="personal">Personal</option>
                  <option value="health">Health</option>
                  <option value="debt-obligations">Debt Obligations</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Desired Loan Amount</label>
                <input type="number" id="loanAmt" value={form.loanAmt} onChange={handleChange} placeholder="e.g. 500000" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Interest Rate (% p.a.)</label>
                <input type="number" step="0.01" id="interestRate" value={form.interestRate} onChange={handleChange} placeholder="e.g. 10.5" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>

              {/* <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Tenure (Months)</label>
                <input type="number" id="tenure" value={form.tenure} onChange={handleChange} placeholder="e.g. 36" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div> */}
            </div>

            <button
              onClick={runPredictor}
              className="mt-8 w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all duration-300 transform hover:-translate-y-1"
            >
              Analyze Profile Eligibility
            </button>
          </div>

          {/* RESULT CARD */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`bg-white p-8 rounded-3xl shadow-xl border border-slate-100 transition-all duration-500 ${result.calculated ? 'opacity-100' : 'opacity-60'}`}>
              <h3 className="text-center text-slate-500 font-medium uppercase tracking-widest text-sm mb-6">Approval Probability</h3>
              
              <div className="relative flex items-center justify-center mb-8">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={440} 
                    strokeDashoffset={440 - (440 * result.probability) / 100}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ease-out ${getScoreColor(result.probability)}`}
                  />
                </svg>
                
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
                  <span className="text-slate-500 font-medium">Max Eligible Amount</span>
                  <span className="text-slate-900 font-bold text-lg">₹{result.eligibleAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                  <span className="text-slate-500 font-medium">Monthly Loan EMI</span>
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