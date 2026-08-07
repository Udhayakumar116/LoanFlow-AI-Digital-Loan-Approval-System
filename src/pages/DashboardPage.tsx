import React, { useEffect, useState } from 'react';
import { formatINR } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LoanApplication, LoanProduct } from '../types';
import { Link } from 'react-router-dom';
import {
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Calculator,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, role } = useAuth();
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [loansRes, productsRes] = await Promise.all([api.getLoans(), api.getProducts()]);
        setLoans(loansRes);
        setProducts(productsRes);
      } catch (e) {
        console.error('Failed to load dashboard data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalRequested = loans.reduce((acc, l) => acc + l.requestedAmount, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-8 text-white border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI-Powered Digital Lending Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            LoanFlow processes instant loan approvals using Google Gemini AI eligibility engines, document OCR validation, and real-time risk assessment.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/apply"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/30"
            >
              <span>Apply for New Loan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/calculator"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
            >
              <Calculator className="w-4 h-4 text-sky-400" />
              <span>EMI Calculator</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Applications</p>
            <p className="text-2xl font-bold text-white mt-1">{loans.length}</p>
            <span className="text-[11px] text-emerald-400 font-medium">Active Pipeline</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Requested Value</p>
            <p className="text-2xl font-bold text-white mt-1">{formatINR(totalRequested)}</p>
            <span className="text-[11px] text-slate-400">Across products</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Avg Credit Score</p>
            <p className="text-2xl font-bold text-white mt-1">745</p>
            <span className="text-[11px] text-blue-400 font-medium">Low Risk Pool</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">AI Eligibility Avg</p>
            <p className="text-2xl font-bold text-white mt-1">82%</p>
            <span className="text-[11px] text-emerald-400 font-medium">Fast-track Eligible</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Applications & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Applications List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span>Active Loan Applications</span>
            </h2>
            <Link to="/track" className="text-xs text-blue-400 hover:underline font-semibold">
              View All
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
            {loans.map((loan) => (
              <div key={loan.id} className="p-5 hover:bg-slate-800/50 transition space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-400">{loan.id}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{loan.productName}</h3>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                      loan.status === 'SANCTIONED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : loan.status === 'OFFICER_APPROVED'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {loan.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-slate-400">Requested Amount</p>
                    <p className="text-sm font-bold text-slate-200">{formatINR(loan.requestedAmount)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-slate-400">Monthly EMI</p>
                    <p className="text-sm font-bold text-slate-200">{formatINR(loan.monthlyEmi)}/mo</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-slate-400">AI Eligibility Score</p>
                    <p className="text-sm font-bold text-emerald-400">{loan.eligibilityResult.score}/100</p>
                  </div>
                </div>

                {/* AI Reason Preview */}
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/50 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center space-x-1.5 font-semibold text-blue-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>AI Evaluation Insight</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{loan.eligibilityResult.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Products Sidebar */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>Loan Products</span>
          </h2>

          <div className="space-y-3">
            {products.map((prod) => (
              <div key={prod.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">{prod.name}</h3>
                  <span className="text-xs font-bold text-emerald-400">{prod.interestRate}% p.a.</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Limit up to {formatINR(prod.maxAmount)} ({prod.minTenure}-{prod.maxTenure} months)
                </p>
                <div className="pt-2 flex justify-end">
                  <Link
                    to="/apply"
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};


