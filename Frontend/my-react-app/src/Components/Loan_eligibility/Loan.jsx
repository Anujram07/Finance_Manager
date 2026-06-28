import React, { useEffect, useState } from "react";

const Loan = () => {
  const [form, setForm] = useState({

    age: "",

    occupation_status: "Employed",

    years_employed: "",

    monthly_income: "",

    credit_score: "",

    credit_history_years: "",

    savings_assets: "",

    current_debt: "",

    defaults_on_file: 0,

    delinquencies_last_2yrs: 0,

    derogatory_marks: 0,

    product_type: "Personal Loan",

    loan_intent: "Personal",

    loan_amount: "",

    interest_rate: ""

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
    setForm({
      ...form,
      [e.target.id]: e.target.value
    });
  };

  const saveLoanData = async (payload) => {
    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/data/loan",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save loan data"
        );
      }

      console.log("Loan data saved:", data);

    } catch (error) {

      console.error(
        "Error saving loan data:",
        error.message
      );

    }
  };

  const runPredictor = async () => {

    try {

      const token = localStorage.getItem("token");

      const payload = {

        age: Number(form.age),

        occupation_status:
          form.occupation_status,

        years_employed:
          Number(form.years_employed),

        annual_income:
          parseFloat(form.annual_income || 0) * 12,

        credit_score:
          Number(form.credit_score),

        credit_history_years:
          Number(
            form.credit_history_years ||
            form.years_employed
          ),

        savings_assets:
          Number(form.savings_assets || 0),

        current_debt:
          Number(form.current_debt),

        defaults_on_file:
          Number(form.defaults_on_file || 0),

        delinquencies_last_2yrs:
          Number(form.delinquencies_last_2yrs || 0),

        derogatory_marks:
          Number(form.derogatory_marks || 0),

        product_type:
          form.product_type,

        loan_intent:
          form.loan_intent,

        loan_amount:
          Number(form.loan_amount),

        interest_rate:
          Number(form.interest_rate)

      };

      console.log(form);

      const response = await fetch(
        "http://localhost:5000/api/loan/predict",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Prediction failed"
        );
      }

      setResult({
        probability:
          data.result.probability,

        eligibleAmount:
          data.result.eligibleAmount,

        emi:
          data.result.emi,

        tips:
          data.result.tips || [],

        calculated: true
      });

      saveLoanData({
        ...form,
        result: data.result
      });

    } catch (error) {

      console.error(error);

      alert(error.message);

    }

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
                <select id="occupation_status" value={form.occupation_status} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition">
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="student">Student</option>
                  <option value="retired">Retired</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Years of Employment / Work</label>
                <input type="number" id="years_employed" value={form.years_employed} onChange={handleChange} placeholder="e.g. 4" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Monthly Net Income</label>
                <input
                  type="number"
                  id="annual_income"
                  value={form.annual_income} onChange={handleChange} placeholder="e.g. 50000" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Credit Score (CIBIL)</label>
                <input
                  id="credit_score"
                  value={form.credit_score} onChange={handleChange} placeholder="300-900" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>

              <div className="space-y-2">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-600">Current Aggregated Debt</label>
                  <span className="text-[10px] text-slate-400 font-medium leading-tight">Sum total of unpaid bills, existing EMIs & loans (&le; 12 months)</span>
                </div>
                <input
                  id="current_debt"
                  value={form.current_debt} onChange={handleChange} placeholder="e.g. 60000" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Loan Type</label>
                <select
                  id="loan_intent"
                  value={form.loan_intent} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition">
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
                <input
                  id="loan_amount"
                  value={form.loan_amount} onChange={handleChange} placeholder="e.g. 500000" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Interest Rate (% p.a.)</label>
                <input
                  id="interest_rate"
                  value={form.interest_rate} onChange={handleChange} placeholder="e.g. 10.5" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
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