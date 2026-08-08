import { LoanApplication, LoanProduct, ManagerAnalytics } from '../types';

const API_BASE = 'https://loanflow-ai-digital-loan-approval-system.onrender.com/api/v1';
export const api = {
  async getProducts(): Promise<LoanProduct[]> {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch loan products');
    return res.json();
  },

  async getLoans(): Promise<LoanApplication[]> {
    const res = await fetch(`${API_BASE}/loans`);
    if (!res.ok) throw new Error('Failed to fetch loan applications');
    return res.json();
  },

  async applyLoan(payload: Partial<LoanApplication>): Promise<LoanApplication> {
    const res = await fetch(`${API_BASE}/loans/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to submit loan application');
    return res.json();
  },

  async extractOCR(docType: string): Promise<any> {
    const res = await fetch('/api/ai/ocr-extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docType }),
    });
    if (!res.ok) throw new Error('Failed to extract document OCR');
    return res.json();
  },

  async submitOfficerDecision(loanId: string, decision: 'APPROVE' | 'REJECT' | 'MORE_DOCS', comments: string): Promise<any> {
    const res = await fetch('/api/officer/decide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loanId, decision, comments }),
    });
    if (!res.ok) throw new Error('Officer decision failed');
    return res.json();
  },

  async submitManagerOverride(loanId: string, decision: 'APPROVE' | 'REJECT'): Promise<any> {
    const res = await fetch('/api/manager/override', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loanId, decision }),
    });
    if (!res.ok) throw new Error('Manager override failed');
    return res.json();
  },

  async getManagerAnalytics(): Promise<ManagerAnalytics> {
    const res = await fetch('/api/manager/analytics');
    if (!res.ok) throw new Error('Failed to fetch manager analytics');
    return res.json();
  },
};