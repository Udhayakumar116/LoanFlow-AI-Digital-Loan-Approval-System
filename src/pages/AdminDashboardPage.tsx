import React, { useState } from 'react';
import { Users, Settings, Database, Shield, Sliders, CheckCircle2 } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'settings'>('users');

  const usersList = [
    { id: 1, email: 'admin@loanflow.com', name: 'System Admin', role: 'ROLE_ADMIN', status: 'ACTIVE' },
    { id: 2, email: 'officer@loanflow.com', name: 'Sarah Jenkins', role: 'ROLE_LOAN_OFFICER', status: 'ACTIVE' },
    { id: 3, email: 'manager@loanflow.com', name: 'David Miller', role: 'ROLE_MANAGER', status: 'ACTIVE' },
    { id: 4, email: 'customer@loanflow.com', name: 'Alex Morgan', role: 'ROLE_CUSTOMER', status: 'ACTIVE' },
  ];

  const systemSettings = [
    { key: 'HIGH_LOAN_VALUE_THRESHOLD', value: '$1,000,000', desc: 'Threshold for Manager Approval escalation' },
    { key: 'AUTO_AI_ELIGIBILITY_TRIGGER', value: 'TRUE', desc: 'Automatically execute Gemini AI model on application submission' },
    { key: 'MAX_DEBT_TO_INCOME_RATIO', value: '0.50 (50%)', desc: 'Hard limit for debt obligations relative to income' },
    { key: 'FRAUD_CHECK_STRICT_MODE', value: 'TRUE', desc: 'Enable strict duplicate identity cross-checks' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
          <Users className="w-3.5 h-3.5" />
          <span>System Administration Portal</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Admin Governance & Settings</h1>
        <p className="text-xs text-slate-400">Manage user roles, configure loan product interest rates, and update system risk parameters.</p>
      </div>

      {/* Admin Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          User Role Management
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          System Risk Parameters
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 text-xs font-bold uppercase text-slate-400 tracking-wider">
            System Users & Role Assignments
          </div>
          <div className="divide-y divide-slate-800">
            {usersList.map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{u.name} ({u.email})</p>
                  <p className="text-[10px] text-slate-400">User ID: #{u.id}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-blue-400 font-mono font-bold text-[10px]">
                    {u.role}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">
                    {u.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 text-xs font-bold uppercase text-slate-400 tracking-wider">
            System Business Rules & Limits
          </div>
          <div className="divide-y divide-slate-800">
            {systemSettings.map((s) => (
              <div key={s.key} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white font-mono">{s.key}</p>
                  <p className="text-[11px] text-slate-400">{s.desc}</p>
                </div>
                <span className="px-3 py-1 rounded bg-slate-950 border border-slate-800 text-emerald-400 font-bold">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
