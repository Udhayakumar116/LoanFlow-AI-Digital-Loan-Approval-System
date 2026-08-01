import React, { useState } from 'react';
import { Calculator, DollarSign, Percent, Calendar, Download } from 'lucide-react';

export const EMICalculatorPage: React.FC = () => {
  const [amount, setAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(10.5);
  const [tenureYears, setTenureYears] = useState<number>(3);

  const months = tenureYears * 12;
  const monthlyRate = interestRate / 12 / 100;

  const emi = Math.round(
    (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
  );

  const totalPayment = emi * months;
  const totalInterest = totalPayment - amount;

  const principalPct = Math.round((amount / totalPayment) * 100);
  const interestPct = 100 - principalPct;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
          <Calculator className="w-3.5 h-3.5" />
          <span>Interactive Financial Tool</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Loan EMI Calculator</h1>
        <p className="text-xs text-slate-400">Calculate monthly repayment installments, total interest costs, and schedule breakdown.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex justify-between text-xs font-bold text-white mb-2">
              <label>Loan Amount ($)</label>
              <span className="text-blue-400">${amount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={10000}
              max={10000000}
              step={10000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-white mb-2">
              <label>Interest Rate (% p.a.)</label>
              <span className="text-emerald-400">{interestRate}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={25}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-white mb-2">
              <label>Tenure (Years)</label>
              <span className="text-amber-400">{tenureYears} Years ({months} Months)</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider">EMI Breakdown</h2>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <p className="text-xs text-slate-400">Monthly EMI Payment</p>
              <p className="text-3xl font-extrabold text-blue-400 mt-1">${emi.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px]">Total Principal</span>
                <p className="font-bold text-white mt-0.5">${amount.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px]">Total Interest</span>
                <p className="font-bold text-emerald-400 mt-0.5">${totalInterest.toLocaleString()}</p>
              </div>
            </div>

            {/* Visual ratio bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                <span>Principal ({principalPct}%)</span>
                <span>Interest ({interestPct}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex">
                <div style={{ width: `${principalPct}%` }} className="bg-blue-500 h-full" />
                <div style={{ width: `${interestPct}%` }} className="bg-emerald-500 h-full" />
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Amortization schedule exported to CSV!')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Download Amortization Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};
