import React, { useMemo, useState } from 'react';
import { Target, Car, Home, Laptop, Briefcase, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

const Goal = ({ financialSummary = {}, loan = {}, className = '' }) => {
  const [goalName, setGoalName] = useState('Car');
  const [goalCost, setGoalCost] = useState('');

  const income = Number(financialSummary.income || 0);
  const expenses = Number(financialSummary.expenses || 0);
  const savings = Number(financialSummary.savings || income - expenses || 0);

  const evaluation = useMemo(() => {
    const cost = Number(goalCost) || 0;
    if (cost <= 0) return null;

    if (savings >= cost) {
      return {
        status: 'success',
        title: 'Ready for Purchase (Cash upfront)',
        text: `Excellent! Your immediate surplus savings pool (₹${savings.toLocaleString('en-IN')}) is completely capable of covering this item upfront without requiring external credit leveraging.`,
        icon: <CheckCircle2 className="text-emerald-500 w-8 h-8" />,
      };
    }

    const estimatedEMI = cost * 0.02;
    const canAffordEMI = savings > estimatedEMI;
    const loanCoverageFits = Number(loan.eligibleAmount || 0) >= cost;

    if (loanCoverageFits && canAffordEMI && Number(loan.probability || 0) >= 70) {
      return {
        status: 'info',
        title: 'Financially Viable (Via Financed Loan)',
        text: `You can purchase this target. Your pre-approved credit ceiling (₹${Number(loan.eligibleAmount || 0).toLocaleString('en-IN')}) covers the capital requirement, and your monthly budget surplus can digest the estimated EMI of ~₹${Math.round(estimatedEMI).toLocaleString('en-IN')}/mo without breaking your ledger margins.`,
        icon: <CheckCircle2 className="text-blue-500 w-8 h-8" />,
      };
    }

    return {
      status: 'warning',
      title: 'Deferred / Purchase Not Advised',
      text: `Your current configuration is over-leveraged for this purchase. The asset price exceeds your eligibility threshold (₹${Number(loan.eligibleAmount || 0).toLocaleString('en-IN')}), or the estimated monthly EMIs would severely wipe out your remaining buffer safety net.`,
      icon: <AlertCircle className="text-rose-500 w-8 h-8" />,
    };
  }, [goalCost, income, expenses, savings, loan]);

  const getGoalIcon = () => {
    switch (goalName) {
      case 'Car':
        return <Car className="text-slate-600" size={20} />;
      case 'House':
        return <Home className="text-slate-600" size={20} />;
      case 'Gadget':
        return <Laptop className="text-slate-600" size={20} />;
      default:
        return <Briefcase className="text-slate-600" size={20} />;
    }
  };

  return (
    <div className={`bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/40 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
          <Target size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black tracking-tight">Predictive Financial Goal Assessor</h3>
          <p className="text-xs text-slate-400 font-medium">Cross-references ledger savings velocity alongside credit matrix rules.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 space-y-4">
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Target Goal</label>
            <div className="relative flex items-center">
              <span className="absolute left-4">{getGoalIcon()}</span>
              <select
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500 transition appearance-none cursor-pointer"
              >
                <option value="Car">Purchase Vehicle (Car/Bike)</option>
                <option value="House">Real Estate / House Deposit</option>
                <option value="Gadget">Tech Infrastructure (Laptop/Phone)</option>
                <option value="Custom">Other Contingent Assets</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Target Cost (₹)</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 font-bold text-slate-400 text-sm">₹</span>
              <input
                type="number"
                placeholder="e.g. 800000"
                value={goalCost}
                onChange={(e) => setGoalCost(e.target.value)}
                className="w-full pl-9 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-7 h-full flex items-center">
          {!goalCost ? (
            <div className="w-full p-6 border-2 border-dashed border-slate-100 rounded-[2rem] text-center text-slate-400 space-y-2 flex flex-col items-center py-10">
              <HelpCircle size={32} className="text-slate-300 animate-bounce" />
              <p className="text-sm font-bold text-slate-600">Awaiting Target Parameters</p>
              <p className="text-xs max-w-xs text-slate-400">Specify an item valuation figure to invoke real-time simulation logic.</p>
            </div>
          ) : (
            <div className={`w-full p-6 rounded-[2rem] border transition-all duration-300 flex items-start gap-5 ${
              evaluation?.status === 'success' ? 'bg-emerald-50/60 border-emerald-100' :
              evaluation?.status === 'info' ? 'bg-blue-50/60 border-blue-100' : 'bg-rose-50/60 border-rose-100'
            }`}>
              <div className="shrink-0 p-1">{evaluation?.icon}</div>
              <div className="space-y-1.5">
                <h4 className={`text-base font-black ${
                  evaluation?.status === 'success' ? 'text-emerald-900' :
                  evaluation?.status === 'info' ? 'text-blue-900' : 'text-rose-900'
                }`}>{evaluation?.title}</h4>
                <p className={`text-xs font-medium leading-relaxed ${
                  evaluation?.status === 'success' ? 'text-emerald-700' :
                  evaluation?.status === 'info' ? 'text-blue-700' : 'text-rose-700'
                }`}>{evaluation?.text}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Goal;
