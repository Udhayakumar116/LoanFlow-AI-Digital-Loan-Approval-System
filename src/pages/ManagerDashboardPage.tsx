import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { LoanApplication, ManagerAnalytics } from '../types';
import { TrendingUp, DollarSign, ShieldAlert, CheckCircle, XCircle, PieChart, BarChart2 } from 'lucide-react';

export const ManagerDashboardPage: React.FC = () => {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [analytics, setAnalytics] = useState<ManagerAnalytics | null>(null);

  useEffect(() => {
    async function loadData() {
      const [loansRes, analyticsRes] = await Promise.all([api.getLoans(), api.getManagerAnalytics()]);
      setLoans(loansRes);
      setAnalytics(analyticsRes);
    }
    loadData();
  }, []);

  const highValueLoans = loans.filter((l) => l.requestedAmount >= 1000000 || l.status === 'OFFICER_APPROVED');

  const handleOverride = async (loanId: string, decision: 'APPROVE' | 'REJECT') => {
    await api.submitManagerOverride(loanId, decision);
    const updated = await api.getLoans();
    setLoans(updated);
    alert(`Manager override '${decision}' executed for loan ${loanId}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold border border-purple-500/20">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Branch Manager Executive Portal</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Manager Approvals & Analytics</h1>
        <p className="text-xs text-slate-400">High-value loan approvals (&gt; $1M), decision overrides, and portfolio risk distributions.</p>
      </div>

      {/* High Value Approvals Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase text-slate-400 tracking-wider flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>High-Value Loan Approval Queue (&gt; $1,000,000)</span>
        </h2>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800 shadow-xl">
          {highValueLoans.map((loan) => (
            <div key={loan.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-blue-400">{loan.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-purple-950 text-purple-300 border border-purple-800">
                    High Value Escalation
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{loan.applicantName} - {loan.productName}</h3>
                <p className="text-xs text-slate-400">Requested: <span className="font-bold text-emerald-400">${loan.requestedAmount.toLocaleString()}</span> • Income: ${loan.monthlyIncome.toLocaleString()}/mo</p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleOverride(loan.id, 'APPROVE')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/20"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Manager Approve</span>
                </button>
                <button
                  onClick={() => handleOverride(loan.id, 'REJECT')}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-rose-600/20"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Dashboard Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-blue-400" />
              <span>Loan Application Status Pipeline</span>
            </h3>
            <div className="space-y-2">
              {analytics.statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-medium">{item.name}</span>
                  <span className="font-bold text-blue-400">{item.count} applications</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <span>Portfolio Risk Distribution</span>
            </h3>
            <div className="space-y-2">
              {analytics.riskDistribution.map((risk) => (
                <div key={risk.level} className="flex items-center justify-between text-xs p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-medium">{risk.level}</span>
                  <span className="font-bold text-emerald-400">{risk.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
