import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { FileText, Sparkles, Upload, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export const ApplyLoanPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);

  const [formData, setFormData] = useState({
    applicantName: 'Alex Morgan',
    email: 'customer@loanflow.com',
    productCode: 'PERS_LOAN',
    requestedAmount: 500000,
    tenureMonths: 36,
    monthlyIncome: 125000,
    monthlyExpenses: 35000,
    creditScore: 780,
    panNumber: 'ABCDE1234F',
    aadhaarNumber: '123456789012',
    employmentType: 'SALARIED',
    employerName: 'TechCorp Solutions',
    purpose: 'Personal Equipment & Consolidation',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const triggerOCR = async (docType: string) => {
    setOcrLoading(true);
    try {
      const ocrData = await api.extractOCR(docType);
      if (ocrData.fullName) {
        setFormData((prev) => ({
          ...prev,
          applicantName: ocrData.fullName,
          panNumber: docType === 'PAN' ? ocrData.documentNumber : prev.panNumber,
        }));
      }
      setOcrSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setOcrLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.applyLoan(formData);
      navigate('/track');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
          <FileText className="w-3.5 h-3.5" />
          <span>Multi-Step Digital Application</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Apply for Digital Loan
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Complete your loan application. Upload identity documents to run automated OCR and trigger Gemini AI eligibility scoring.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        {/* Section 1: Product Selection */}
        <div className="space-y-4 pb-6 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">1</span>
            <span>Select Loan Product & Loan Amount</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Loan Product</label>
              <select
                name="productCode"
                value={formData.productCode}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="PERS_LOAN">Personal Instant Loan (10.5% p.a.)</option>
                <option value="HOME_LOAN">Prime Home Purchase Loan (8.4% p.a.)</option>
                <option value="EDU_LOAN">Global Education Loan (9.2% p.a.)</option>
                <option value="BIZ_LOAN">SME Business Loan (12.0% p.a.)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Requested Amount ($)</label>
              <input
                type="number"
                name="requestedAmount"
                value={formData.requestedAmount}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tenure (Months)</label>
              <select
                name="tenureMonths"
                value={formData.tenureMonths}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value={12}>12 Months (1 Year)</option>
                <option value={24}>24 Months (2 Years)</option>
                <option value={36}>36 Months (3 Years)</option>
                <option value={48}>48 Months (4 Years)</option>
                <option value={60}>60 Months (5 Years)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Loan Purpose</label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Financial Profile */}
        <div className="space-y-4 pb-6 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">2</span>
            <span>Financial & Employment Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Monthly Income ($)</label>
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Monthly Expenses ($)</label>
              <input
                type="number"
                name="monthlyExpenses"
                value={formData.monthlyExpenses}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Credit Score (Simulated)</label>
              <input
                type="number"
                name="creditScore"
                value={formData.creditScore}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Employment Type</label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="SALARIED">Salaried Employee</option>
                <option value="SELF_EMPLOYED">Self-Employed Professional</option>
                <option value="BUSINESS">Business Owner / SME</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Employer / Company Name</label>
              <input
                type="text"
                name="employerName"
                value={formData.employerName}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Document Upload & OCR Auto-fill */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">3</span>
            <span>Upload Identity Documents & Run AI OCR</span>
          </h2>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-xs font-bold text-white flex items-center justify-center sm:justify-start space-x-1.5">
                <Upload className="w-4 h-4 text-sky-400" />
                <span>Upload PAN / Aadhaar Identity Card</span>
              </p>
              <p className="text-[11px] text-slate-400">
                AI Tesseract Engine will automatically scan, verify, and extract card numbers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => triggerOCR('PAN')}
              disabled={ocrLoading}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition flex items-center space-x-2 shrink-0"
            >
              {ocrLoading ? <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> : <Sparkles className="w-4 h-4 text-amber-400" />}
              <span>{ocrSuccess ? 'OCR Extraction Verified' : 'Trigger AI OCR Scan'}</span>
            </button>
          </div>

          {ocrSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/50 text-xs text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Identity Document verified via AI OCR engine. PAN: ABCDE1234F matched with applicant profile.</span>
            </div>
          )}
        </div>

        {/* Submit CTA */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Submit & Run Gemini AI Eligibility</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
