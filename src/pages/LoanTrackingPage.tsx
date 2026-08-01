import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { LoanApplication } from '../types';
import { FileText, CheckCircle2, Clock, AlertCircle, Download, Sparkles, ShieldCheck } from 'lucide-react';

export const LoanTrackingPage: React.FC = () => {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [showSanctionLetter, setShowSanctionLetter] = useState(false);

  useEffect(() => {
    async function fetchLoans() {
      try {
        const data = await api.getLoans();
        setLoans(data);
        if (data.length > 0) setSelectedLoan(data[0]);
      } catch (e) {
        console.error(e);
      }
    }
    fetchLoans();
  }, []);

  const steps = [
    { key: 'SUBMITTED', title: 'Submitted', desc: 'Application received' },
    { key: 'DOCUMENT_VERIFICATION', title: 'OCR Verification', desc: 'Document verification' },
    { key: 'OFFICER_APPROVED', title: 'Officer Approved', desc: 'Loan officer review' },
    { key: 'SANCTIONED', title: 'Sanctioned', desc: 'Sanction letter issued' },
    { key: 'DISBURSED', title: 'Disbursed', desc: 'Funds transferred' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Loan Tracking & Status Pipeline</h1>
        <p className="text-xs text-slate-400">Track real-time progress of your digital loan applications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Loan Selection list */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Your Applications</h2>
          {loans.map((loan) => (
            <div
              key={loan.id}
              onClick={() => setSelectedLoan(loan)}
              className={`p-4 rounded-xl cursor-pointer border transition ${
                selectedLoan?.id === loan.id
                  ? 'bg-blue-950/60 border-blue-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400">{loan.id}</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-800 border border-slate-700">
                  {loan.status}
                </span>
              </div>
              <p className="text-sm font-bold mt-1">{loan.productName}</p>
              <p className="text-xs text-slate-400">${loan.requestedAmount.toLocaleString()} • {loan.tenureMonths} mos</p>
            </div>
          ))}
        </div>

        {/* Selected Application Timeline & Detail */}
        {selectedLoan && (
          <div className="lg:col-span-2 space-y-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400">{selectedLoan.id}</span>
                <h2 className="text-lg font-bold text-white">{selectedLoan.productName}</h2>
              </div>
              <button
                onClick={() => setShowSanctionLetter(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Sanction Letter PDF</span>
              </button>
            </div>

            {/* Workflow Timeline Progress */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Approval Workflow Timeline</h3>
              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
                {steps.map((step, idx) => {
                  const isCompleted = true; // Simulated completed step
                  return (
                    <div key={step.key} className="flex md:flex-col items-center space-x-3 md:space-x-0 md:space-y-2 text-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">{step.title}</p>
                        <p className="text-[10px] text-slate-400">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Eligibility Insights */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-400">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Eligibility & Risk Analysis</span>
              </div>
              <p className="text-xs text-slate-300">{selectedLoan.eligibilityResult.reason}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Eligibility Score</span>
                  <p className="font-bold text-emerald-400">{selectedLoan.eligibilityResult.score}/100</p>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Approval Prob.</span>
                  <p className="font-bold text-blue-400">{selectedLoan.eligibilityResult.approvalProbability}%</p>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400">DTI Ratio</span>
                  <p className="font-bold text-slate-200">{selectedLoan.eligibilityResult.dtiRatio}</p>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Risk Assessment</span>
                  <p className="font-bold text-emerald-400">{selectedLoan.riskAssessment.riskLevel}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sanction Letter Modal */}
      {showSanctionLetter && selectedLoan && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Official Loan Sanction Letter</h3>
              </div>
              <button onClick={() => setShowSanctionLetter(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 font-serif text-xs leading-relaxed space-y-3 text-slate-300">
              <div className="flex justify-between font-sans text-[11px] font-bold text-blue-400 border-b border-slate-800 pb-2">
                <span>Ref: LOANFLOW/SANCTION/{selectedLoan.id}</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>
              <p>Dear <strong>{selectedLoan.applicantName}</strong>,</p>
              <p>
                We are pleased to inform you that your application for <strong>{selectedLoan.productName}</strong> has been <strong>SANCTIONED</strong> based on automated Gemini AI credit evaluation and risk review.
              </p>
              <div className="font-sans grid grid-cols-2 gap-2 p-3 bg-slate-900 rounded border border-slate-800 text-[11px]">
                <div>Sanctioned Amount: <strong>${selectedLoan.requestedAmount.toLocaleString()}</strong></div>
                <div>Tenure: <strong>{selectedLoan.tenureMonths} Months</strong></div>
                <div>Interest Rate: <strong>{selectedLoan.interestRate}% p.a.</strong></div>
                <div>Monthly EMI: <strong>${selectedLoan.monthlyEmi.toLocaleString()}</strong></div>
              </div>
              <p className="text-[10px] text-slate-400">Authorized Signatory: Branch Manager David Miller • LoanFlow Digital Enterprise</p>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => alert('Sanction Letter PDF downloaded successfully!')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Download PDF
              </button>
              <button
                onClick={() => setShowSanctionLetter(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
