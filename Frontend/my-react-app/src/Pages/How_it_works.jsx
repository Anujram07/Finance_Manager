import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

const StepCard = ({ step, title, desc }) => (
  <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
      {step}
    </div>
    <div className="mt-6">
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-4">{desc}</p>
      <div className="flex items-center text-emerald-600 font-semibold text-sm">
        Learn more
        <ArrowRight size={16} className="ml-2" />
      </div>
    </div>
  </div>
);

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-slate-50 py-24 px-6">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <CheckCircle size={16} />
            Simple Process
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            How FinanceView Works
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get started with just a few simple steps. Our AI-powered system analyzes your financial data and provides instant loan eligibility insights.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <StepCard step="01" title="Enter Your Details" desc="Provide your income, expenses, and credit information securely." />
          <StepCard step="02" title="AI Analysis" desc="Our system analyzes your data using advanced algorithms." />
          <StepCard step="03" title="Get Results" desc="Receive your loan eligibility score and personalized recommendations." />
        </div>
      </div>

      {/* Detailed Explanation Section */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-12 border border-slate-100">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Technology Behind FinanceView
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="text-emerald-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Machine Learning Models</h3>
                    <p className="text-slate-600 text-sm">Trained on millions of financial records</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="text-emerald-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Real-time Analysis</h3>
                    <p className="text-slate-600 text-sm">Instant loan eligibility scoring</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="text-emerald-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Bank-Grade Security</h3>
                    <p className="text-slate-600 text-sm">256-bit encryption for data protection</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100">
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Average Processing Time</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-2">2 seconds</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Accuracy Rate</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-2">94.7%</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Users Analyzed</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-2">50K+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}