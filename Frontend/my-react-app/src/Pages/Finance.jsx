import React, { useState, useEffect } from "react";
import Goal from "../Components/Goal/Goal";
import FinancialChatbot from "../Components/FinancialChatbot";

const FinanceManager = () => {
  // --- 1. CORE UPGRADED STATES ---
  const [incomes, setIncomes] = useState(() => {
    const saved = localStorage.getItem("local_fin_incomes");
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "Salary", type: "Fixed", min: 50000, max: 50000 },
      { id: "2", name: "Freelancing", type: "Variable", min: 5000, max: 15000 }
    ];
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("local_fin_expenses");
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "Rent", type: "Fixed", min: 12000, max: 12000, important: true },
      { id: "2", name: "Food", type: "Variable", min: 4000, max: 8000, important: false }
    ];
  });

  // Form states
  const [incomeInput, setIncomeInput] = useState({ name: "", type: "Fixed", min: "", max: "" });
  const [expenseInput, setExpenseInput] = useState({ name: "", type: "Fixed", min: "", max: "", important: false });
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  // UI Palette Maps
  const TYPE_COLORS = {
    Fixed: "bg-blue-50 text-blue-700 border-blue-100",
    Variable: "bg-amber-50 text-amber-700 border-amber-100"
  };

  // --- LOAD FINANCE DATA FROM ATLAS ---
  useEffect(() => {
    fetchCurrentFinance();
  }, []);

  useEffect(() => {
    fetchInsights();
  }, []);

  // --- SAVE DATA LOCALLY + ATLAS ---
  useEffect(() => {
    localStorage.setItem(
      "local_fin_incomes",
      JSON.stringify(incomes)
    );

    localStorage.setItem(
      "local_fin_expenses",
      JSON.stringify(expenses)
    );

    if (incomes.length || expenses.length) {
      saveFinanceDataToBackend();
    }

  }, [incomes, expenses]);

  // --- 3. FORM ACTION HANDLERS ---
  const handleAddIncome = (e) => {
    e.preventDefault();
    if (!incomeInput.name || !incomeInput.min) return alert("Please fill out required fields.");

    const minVal = Number(incomeInput.min);
    const maxVal = incomeInput.type === "Fixed" ? minVal : Number(incomeInput.max || minVal);

    setIncomes([...incomes, {
      id: crypto.randomUUID(),
      name: incomeInput.name,
      type: incomeInput.type,
      min: minVal,
      max: maxVal
    }]);
    setIncomeInput({ name: "", type: "Fixed", min: "", max: "" });
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseInput.name || !expenseInput.min) return alert("Please fill out required fields.");

    const minVal = Number(expenseInput.min);
    const maxVal = expenseInput.type === "Fixed" ? minVal : Number(expenseInput.max || minVal);

    setExpenses([...expenses, {
      id: crypto.randomUUID(),
      name: expenseInput.name,
      type: expenseInput.type,
      min: minVal,
      max: maxVal,
      important: expenseInput.important
    }]);
    setExpenseInput({ name: "", type: "Fixed", min: "", max: "", important: false });
  };

  const handleDeleteItem = (id, targetState) => {
    if (targetState === "income") setIncomes(incomes.filter(i => i.id !== id));
    if (targetState === "expense") setExpenses(expenses.filter(e => e.id !== id));
  };

  // --- 4. DATA MATRIX CALCULATIONS ---
  const totalMinIncome = incomes.reduce((sum, item) => sum + item.min, 0);
  const totalMaxIncome = incomes.reduce((sum, item) => sum + item.max, 0);

  const totalMinExpense = expenses.reduce((sum, item) => sum + item.min, 0);
  const totalMaxExpense = expenses.reduce((sum, item) => sum + item.max, 0);

  // Conservative Worst Case Scenarios (Lowest Income vs Highest Expenses)
  const conservativeNetSavings = totalMinIncome - totalMaxExpense;
  // Optimistic Best Case Scenarios (Highest Income vs Lowest Expenses)
  const optimisticNetSavings = totalMaxIncome - totalMinExpense;

  // --- 5. BACKEND DATABASE SYNC ENGINE ---
  const fetchCurrentFinance = async () => {
    try {

      const token = localStorage.getItem("authToken")

      if (!token) return;

      const response = await fetch(
        "http://localhost:5000/api/finance/current",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.success && data.record) {

        setIncomes(
          data.record.incomes.map(item => ({
            id: crypto.randomUUID(),
            name: item.source,
            type: item.type,
            min: item.minimumAmount,
            max: item.maximumAmount
          }))
        );

        setExpenses(
          data.record.expenses.map(item => ({
            id: crypto.randomUUID(),
            name: item.expenseName,
            type: item.type,
            min: item.minimumAmount,
            max: item.maximumAmount,
            important: item.isImportant
          }))
        );
      }

    } catch (error) {
      console.error(error.message);
    }
  };



  const saveFinanceDataToBackend = async () => {
    try {

      const token = localStorage.getItem("authToken")

      if (!token) return;

      const today = new Date();

      const payload = {

        month: today.getMonth() + 1,
        year: today.getFullYear(),

        incomes: incomes.map(item => ({
          source: item.name,
          type: item.type,
          minimumAmount: item.min,
          maximumAmount: item.max,
          actualAmount: item.max
        })),

        expenses: expenses.map(item => ({
          expenseName: item.name,
          category: "General",
          type: item.type,
          minimumAmount: item.min,
          maximumAmount: item.max,
          actualAmount: item.max,
          isImportant: item.important
        })),

        totalMinimumIncome: totalMinIncome,
        totalMaximumIncome: totalMaxIncome,

        totalMinimumExpense: totalMinExpense,
        totalMaximumExpense: totalMaxExpense,

        conservativeNetSavings,
        optimisticNetSavings

      };

      const response = await fetch(
        "http://localhost:5000/api/finance",
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
        throw new Error(data.message);
      }

      console.log("Finance Saved", data);

    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchInsights = async () => {

    try {

      setInsightsLoading(true);

      const token = localStorage.getItem("authToken");

      if (!token) return;

      const response = await fetch(
        "http://localhost:5000/api/insights",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {

        setInsights(data.insights);

      }

    } catch (error) {

      console.error(
        "Failed to fetch insights:",
        error.message
      );

    } finally {

      setInsightsLoading(false);

    }

  };

  return (
    <section className="py-12 bg-slate-50 min-h-screen font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-center border-b border-slate-200 pb-6 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Advanced Matrix Budget Engine</h2>
            <p className="text-slate-500 text-sm mt-1">Simulating variable variance, protected allocations, and financial goals runway.</p>
          </div>
          <div className="bg-emerald-50 text-emerald-700 text-xs px-4 py-2 font-bold rounded-xl border border-emerald-200">
            🛡️ Local Storage Live Synchronization Active
          </div>
        </div>

        {/* CORE WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: INCOME MANIFEST */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-extrabold text-md text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-4 bg-blue-500 rounded-sm"></span> Stream Inflows (Income)
              </h3>

              {/* Form Input */}
              <form
                onSubmit={handleAddIncome}
                className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100"
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={incomeInput.name}
                  onChange={(e) => setIncomeInput({ ...incomeInput, name: e.target.value })}
                  className="p-2 border text-xs bg-white rounded-md outline-none"
                  required
                />

                <select
                  value={incomeInput.type}
                  onChange={(e) => setIncomeInput({ ...incomeInput, type: e.target.value })}
                  className="p-2 border text-xs bg-white rounded-md outline-none"
                >
                  <option value="Fixed">Fixed</option>
                  <option value="Variable">Variable</option>
                </select>

                <input
                  type="number"
                  placeholder={incomeInput.type === "Fixed" ? "Amount ₹" : "Min ₹"}
                  value={incomeInput.min}
                  onChange={(e) => setIncomeInput({ ...incomeInput, min: e.target.value })}
                  className="p-2 border text-xs bg-white rounded-md outline-none"
                  required
                />

                {incomeInput.type === "Variable" ? (
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={incomeInput.max}
                    onChange={(e) => setIncomeInput({ ...incomeInput, max: e.target.value })}
                    className="p-2 border text-xs bg-white rounded-md outline-none"
                    required
                  />
                ) : (
                  <button
                    type="submit"
                    className="bg-slate-900 text-white text-xs font-bold rounded-md hover:bg-slate-800 transition"
                  >
                    Add Inflow
                  </button>
                )}

                {incomeInput.type === "Variable" && (
                  <div className="sm:col-span-4 mt-1">
                    <button
                      type="submit"
                      className="w-full bg-slate-900 text-white text-xs font-bold py-2 rounded-md hover:bg-slate-800 transition"
                    >
                      Add Variable Inflow
                    </button>
                  </div>
                )}
              </form>

              {/* Data Table */}
              <div className="divide-y divide-slate-100 overflow-y-auto max-h-60">
                {incomes.map(item => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-sm group">
                    <div>
                      <span className="font-bold text-slate-800">{item.name}</span>
                      <span className={`ml-2 text-[9px] font-extrabold px-2 py-0.5 border rounded-full uppercase tracking-wider ${TYPE_COLORS[item.type]}`}>{item.type}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-slate-700 font-semibold">
                        ₹{item.min === item.max ? item.min.toLocaleString('en-IN') : `${item.min.toLocaleString('en-IN')} - ${item.max.toLocaleString('en-IN')}`}
                      </span>
                      <button onClick={() => handleDeleteItem(item.id, 'income')} className="text-slate-300 hover:text-rose-600 font-bold text-xs transition">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PROTECTED EXPENDITURES */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-extrabold text-md text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-4 bg-rose-500 rounded-sm"></span> Expenses
              </h3>

              <form
                onSubmit={handleAddExpense}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 mb-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Expense Name (e.g., Rent)"
                    value={expenseInput.name}
                    onChange={(e) => setExpenseInput({ ...expenseInput, name: e.target.value })}
                    className="p-2 border text-xs bg-white rounded-md outline-none"
                    required
                  />

                  <select
                    value={expenseInput.type}
                    onChange={(e) => setExpenseInput({ ...expenseInput, type: e.target.value })}
                    className="p-2 border text-xs bg-white rounded-md outline-none"
                  >
                    <option value="Fixed">Fixed</option>
                    <option value="Variable">Variable</option>
                  </select>

                  <input
                    type="number"
                    placeholder={expenseInput.type === "Fixed" ? "Amount ₹" : "Min Amount ₹"}
                    value={expenseInput.min}
                    onChange={(e) => setExpenseInput({ ...expenseInput, min: e.target.value })}
                    className="p-2 border text-xs bg-white rounded-md outline-none"
                    required
                  />

                  {expenseInput.type === "Variable" ? (
                    <input
                      type="number"
                      placeholder="Max Amount ₹"
                      value={expenseInput.max}
                      onChange={(e) => setExpenseInput({ ...expenseInput, max: e.target.value })}
                      className="p-2 border text-xs bg-white rounded-md outline-none"
                      required
                    />
                  ) : (
                    <button
                      type="submit"
                      className="bg-slate-900 text-white text-xs font-bold rounded-md hover:bg-slate-800 transition"
                    >
                      Log Outflow
                    </button>
                  )}
                </div>

                {expenseInput.type === "Variable" && (
                  <div className="flex justify-between items-center gap-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-600 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={expenseInput.important}
                        onChange={(e) => setExpenseInput({ ...expenseInput, important: e.target.checked })}
                        className="w-3.5 h-3.5 accent-amber-500 rounded"
                      />
                      🛡️ Mark Important Expense
                    </label>

                    <button
                      type="submit"
                      className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-md hover:bg-slate-800 transition"
                    >
                      Log Outflow
                    </button>
                  </div>
                )}

                {expenseInput.type === "Fixed" && (
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={expenseInput.important}
                      onChange={(e) => setExpenseInput({ ...expenseInput, important: e.target.checked })}
                      className="w-3.5 h-3.5 accent-amber-500 rounded"
                    />
                    🛡️ Mark Important Expense
                  </label>
                )}
              </form>

              {/* Expense List */}
              <div className="divide-y divide-slate-100 overflow-y-auto max-h-60">
                {expenses.map(item => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                    <div>
                      <span className="font-bold text-slate-800">{item.name}</span>
                      {item.important && (
                        <span className="ml-2 text-[9px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full tracking-wider uppercase">🛡️ Important</span>
                      )}
                      <span className={`ml-2 text-[9px] font-extrabold px-2 py-0.5 border rounded-full uppercase tracking-wider ${TYPE_COLORS[item.type]}`}>{item.type}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-slate-700 font-semibold">
                        ₹{item.min === item.max ? item.min.toLocaleString('en-IN') : `${item.min.toLocaleString('en-IN')} - ${item.max.toLocaleString('en-IN')}`}
                      </span>
                      <button onClick={() => handleDeleteItem(item.id, 'expense')} className="text-slate-300 hover:text-rose-600 font-bold text-xs transition">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
          {/* Goal Metrics Module */}
          <div className="lg:col-span-7">
            <Goal />
          </div>

          {/* AI Companion Window Module */}
          <div className="lg:col-span-5 h-full flex">
            <FinancialChatbot
              incomes={incomes}
              expenses={expenses}
              totalMinIncome={totalMinIncome}
              totalMaxExpense={totalMaxExpense}
              conservativeNetSavings={conservativeNetSavings}
            />
          </div>
        </div>

        {/* AI FINANCIAL INSIGHTS */}

        <div className="mt-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h3 className="text-xl font-black text-slate-900">
                AI Financial Insights
              </h3>

              <p className="text-sm text-slate-500">
                Personalized recommendations generated using your financial history, goals and trends.
              </p>
            </div>

          </div>

          {insightsLoading ? (

            <div className="text-center py-8 text-slate-500">
              Analyzing your financial profile...
            </div>

          ) : insights ? (

            <div className="grid md:grid-cols-2 gap-6">

              {/* Financial Health */}

              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-100">

                <h4 className="font-bold text-emerald-700 mb-2">
                  Financial Health
                </h4>

                <p className="text-2xl font-black text-emerald-900">
                  {insights.financialHealth}
                </p>

              </div>

              {/* Recommendations */}

              <div className="p-5 rounded-xl bg-blue-50 border border-blue-100">

                <h4 className="font-bold text-blue-700 mb-3">
                  Recommendations
                </h4>

                <ul className="space-y-2 text-sm text-slate-700">

                  {insights.recommendations?.map(
                    (item, index) => (

                      <li key={index}>
                        • {item}
                      </li>

                    )
                  )}

                </ul>

              </div>

              {/* Warnings */}

              <div className="p-5 rounded-xl bg-amber-50 border border-amber-100">

                <h4 className="font-bold text-amber-700 mb-3">
                  Warnings
                </h4>

                <ul className="space-y-2 text-sm text-slate-700">

                  {insights.warnings?.map(
                    (item, index) => (

                      <li key={index}>
                        • {item}
                      </li>

                    )
                  )}

                </ul>

              </div>

              {/* Opportunities */}

              <div className="p-5 rounded-xl bg-purple-50 border border-purple-100">

                <h4 className="font-bold text-purple-700 mb-3">
                  Opportunities
                </h4>

                <ul className="space-y-2 text-sm text-slate-700">

                  {insights.opportunities?.map(
                    (item, index) => (

                      <li key={index}>
                        • {item}
                      </li>

                    )
                  )}

                </ul>

              </div>

            </div>

          ) : (

            <div className="text-center py-8 text-slate-500">
              No insights available yet.
            </div>

          )}

        </div>

        {/* INTELLIGENT RUNWAY INSIGHT ENGINE BOX */}
        <div className="mt-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">🔮 Strategic Variance Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70">
                <p className="text-xs text-slate-400 font-bold uppercase">Worst-Case Baseline Balance</p>
                <p className={`text-2xl font-black mt-1 ${conservativeNetSavings >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  ₹{conservativeNetSavings.toLocaleString('en-IN')} / mo
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Calculated assuming minimum guaranteed income alongside maximum unexpected variable expenditure spikes.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70">
                <p className="text-xs text-slate-400 font-bold uppercase">Best-Case Target Velocity</p>
                <p className="text-2xl font-black text-blue-600 mt-1">
                  ₹{optimisticNetSavings.toLocaleString('en-IN')} / mo
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Calculated assuming highest expected freelance/variable revenue spikes alongside optimized cutbacks.</p>
              </div>
            </div>

            {/* AI STRATEGY SANITY RULES */}
            <div className="p-5 bg-slate-900 text-slate-100 rounded-xl space-y-3">
              <h4 className="text-xs font-black tracking-widest text-amber-400 uppercase">🛡️ Protected Optimization Blueprint</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Expenses marked with <span className="text-amber-300 font-bold">Important</span> (such as Rent or Medical items) are completely locked down. Future local heuristics will skip analyzing reduction pathways for these indices.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] flex flex-wrap gap-2 text-slate-400">
                <span>Locked items:</span>
                {expenses.filter(e => e.important).map(e => (
                  <span key={e.id} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                    {e.name} (₹{e.max})
                  </span>
                ))}
                {expenses.filter(e => e.important).length === 0 && <span className="italic">None selected yet.</span>}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default FinanceManager;