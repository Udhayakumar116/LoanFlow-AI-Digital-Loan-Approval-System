import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FilePlus,
  Search,
  Calculator,
  UserCheck,
  TrendingUp,
  Users,
  Settings,
  Code2,
  BookOpen,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* Navigation Sections */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Main Portal
          </p>
          <Link
            to="/"
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              isActive('/')
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/calculator"
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              isActive('/calculator')
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>EMI Calculator</span>
          </Link>
        </div>

        {/* Customer Links */}
        {(role === 'ROLE_CUSTOMER' || role === 'ROLE_ADMIN') && (
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Customer Workflows
            </p>
            <Link
              to="/apply"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                isActive('/apply')
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FilePlus className="w-4 h-4 text-emerald-400" />
              <span>Apply for Loan</span>
            </Link>
            <Link
              to="/track"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                isActive('/track')
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4 text-sky-400" />
              <span>Track Application</span>
            </Link>
          </div>
        )}

        {/* Loan Officer Links */}
        {(role === 'ROLE_LOAN_OFFICER' || role === 'ROLE_ADMIN') && (
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Verification & Review
            </p>
            <Link
              to="/officer-queue"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                isActive('/officer-queue')
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>Officer Verification Queue</span>
            </Link>
          </div>
        )}

        {/* Manager Links */}
        {(role === 'ROLE_MANAGER' || role === 'ROLE_ADMIN') && (
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Management & Analytics
            </p>
            <Link
              to="/manager-approvals"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                isActive('/manager-approvals')
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Manager Approvals & KPIs</span>
            </Link>
          </div>
        )}

        {/* Admin Links */}
        {role === 'ROLE_ADMIN' && (
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Admin Governance
            </p>
            <Link
              to="/admin"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                isActive('/admin')
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>Users & System Settings</span>
            </Link>
          </div>
        )}

        {/* System & Architecture */}
        <div className="space-y-1 pt-4 border-t border-slate-800">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Developer Resources
          </p>
          <Link
            to="/architecture"
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              isActive('/architecture')
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Architecture & Specs</span>
          </Link>
        </div>
      </div>

      {/* Tech Stack Banner */}
      <div className="p-4 m-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
        <div className="flex items-center space-x-2 text-slate-300 font-semibold mb-1">
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <span>Java 21 + Spring Boot 3</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Clean Architecture & MySQL 8 database backend.
        </p>
      </div>
    </aside>
  );
};
