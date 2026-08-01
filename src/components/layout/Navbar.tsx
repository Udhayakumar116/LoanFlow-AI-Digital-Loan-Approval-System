import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Shield, Bell, User as UserIcon, Code2, Sparkles, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, role, switchRole } = useAuth();

  const roleLabels: Record<UserRole, { label: string; badgeClass: string }> = {
    ROLE_CUSTOMER: { label: 'Customer', badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
    ROLE_LOAN_OFFICER: { label: 'Loan Officer', badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
    ROLE_MANAGER: { label: 'Manager', badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' },
    ROLE_ADMIN: { label: 'System Admin', badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                LoanFlow
              </span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-md font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                AI Enterprise
              </span>
            </div>
          </Link>
        </div>

        {/* Quick Links & Role Switcher */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <Link
            to="/architecture"
            className="hidden md:flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Code2 className="w-4 h-4 text-sky-400" />
            <span>Architecture & Specs</span>
          </Link>

          {/* Role Switcher Pill */}
          <div className="relative group">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700/80 cursor-pointer hover:border-slate-600 transition">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="text-left hidden sm:block">
                <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Role Persona</p>
                <p className="text-xs font-medium text-slate-200">{roleLabels[role].label}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-1 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-700/60 text-[11px] font-semibold text-slate-400 uppercase">
                Switch Role View
              </div>
              {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-slate-700/70 ${
                    role === r ? 'text-blue-400 font-semibold bg-blue-500/10' : 'text-slate-300'
                  }`}
                >
                  <span>{roleLabels[r].label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${roleLabels[r].badgeClass}`}>
                    {r.replace('ROLE_', '')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Notification Icon */}
          <button className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-slate-900" />
          </button>

          {/* User Profile Info */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 font-bold text-xs ring-1 ring-slate-600">
              {user?.name.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-tight">{user?.name}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{user?.email}</p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
