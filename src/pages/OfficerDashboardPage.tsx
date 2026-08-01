import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { LoanApplication } from '../types';
import { UserCheck, ShieldAlert, Sparkles, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';

export const OfficerDashboardPage: React.FC = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [comments, setComments] = useState('');

  useEffect(() => {
    async function load() {
      const loans = await api.getLoans();
      setApplications(loans);
      if (loans.length > 0) setSelectedApp(loans[0]);
    }
    load();
  }, []);

  const handleDecision = async (decision: 'APPROVE' | 'REJECT' | 'MORE_DOCS') => {
    if (!selectedApp) return;
    await api.submitOfficerDecision(selectedApp.id, decision, comments);
    const updated = await api.getLoans();
    setApplications(updated);
    setSelectedApp(updated.find((l) => l.id === selectedApp.id) || null);
    alert(`Decision '${decision}' recorded successfully.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Loan Officer Queue</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Verification & Review Portal</h1>
        <p className="text-xs text-slate-400">Review OCR documents, evaluate Gemini AI eligibility scores, and record verification decisions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Assigned Applications</h2>
          {applications.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className={`p-4 rounded-xl cursor-pointer border transition ${
                selectedApp?.id === app.id
                  ? 'bg-blue-950/60 border-blue-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400">{app.id}</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-800 text-amber-400">
                  {app.status}
                </span>
              </div>
              <p className="text-sm font-bold mt-1">{app.applicantName}</p>
              <p className="text-xs text-slate-400">${app.requestedAmount.toLocaleString()} • {app.productName}</p>
            </div>
          ))}
        </div>

        {/* Verification Workspace */}
        {selectedApp && (
          <div className="lg:col-span-2 space-y-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400">{selectedApp.id}</span>
                <h2 className="text-lg font-bold text-white">{selectedApp.applicantName} ({selectedApp.email})</h2>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Requested Amount</p>
                <p className="text-lg font-bold text-emerald-400">${selectedApp.requestedAmount.toLocaleString()}</p>
              </div>
            </div>

            {/* AI Review Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>Gemini AI Eligibility Evaluation</span>
              </div>
              <p className="text-xs text-slate-300">{selectedApp.eligibilityResult.reason}</p>
              <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Eligibility Score</span>
                  <p className="font-bold text-emerald-400">{selectedApp.eligibilityResult.score}/100</p>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Approval Prob.</span>
                  <p className="font-bold text-blue-400">{selectedApp.eligibilityResult.approvalProbability}%</p>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Risk Assessment</span>
                  <p className="font-bold text-emerald-400">{selectedApp.riskAssessment.riskLevel}</p>
                </div>
              </div>
            </div>

            {/* Document Verification */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Uploaded Identity & Income Documents</h3>
              <div className="space-y-2">
                {selectedApp.documents.map((doc) => (
                  <div key={doc.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-sky-400" />
                      <div>
                        <p className="font-bold text-white">{doc.type}: {doc.fileName}</p>
                        <span className="text-[10px] text-emerald-400 font-semibold">Status: {doc.status}</span>
                      </div>
                    </div>
                    <button onClick={() => window.open(doc.url, '_blank')} className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-[11px]">
                      View Document
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Form */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <label className="block text-xs font-semibold text-slate-300">Officer Verification Comments</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter verification notes or reasons for approval/rejection..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                rows={3}
              />

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleDecision('APPROVE')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve Application</span>
                </button>
                <button
                  onClick={() => handleDecision('MORE_DOCS')}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center space-x-1.5"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Request Additional Documents</span>
                </button>
                <button
                  onClick={() => handleDecision('REJECT')}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Application</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
