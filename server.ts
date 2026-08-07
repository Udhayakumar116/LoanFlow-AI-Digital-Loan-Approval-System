import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));

// Server-side Gemini AI Client
const getGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// In-memory Database Simulation for Live Demo Preview
const mockUsers = [
  { id: 1, email: 'customer@loanflow.com', name: 'Alex Morgan', role: 'ROLE_CUSTOMER', phone: '+18005550103', active: true },
  { id: 2, email: 'officer@loanflow.com', name: 'Sarah Jenkins', role: 'ROLE_LOAN_OFFICER', phone: '+18005550101', active: true },
  { id: 3, email: 'manager@loanflow.com', name: 'David Miller', role: 'ROLE_MANAGER', phone: '+18005550102', active: true },
  { id: 4, email: 'admin@loanflow.com', name: 'System Admin', role: 'ROLE_ADMIN', phone: '+18005550100', active: true },
];

let mockLoans = [
  {
    id: 'LN-2026-88102',
    applicantName: 'Alex Morgan',
    email: 'customer@loanflow.com',
    productCode: 'PERS_LOAN',
    productName: 'Personal Instant Loan',
    requestedAmount: 450000,
    tenureMonths: 36,
    interestRate: 10.5,
    monthlyEmi: 14620,
    status: 'SUBMITTED',
    purpose: 'Debt Consolidation & Home Renovation',
    monthlyIncome: 125000,
    monthlyExpenses: 35000,
    creditScore: 780,
    panNumber: 'ABCDE1234F',
    aadhaarNumber: '123456789012',
    employmentType: 'SALARIED',
    employerName: 'TechCorp Solutions',
    submittedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    documents: [
      { id: 'doc-1', type: 'PAN', fileName: 'pan_card.pdf', status: 'VERIFIED', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500' },
      { id: 'doc-2', type: 'AADHAAR', fileName: 'aadhaar_card.pdf', status: 'VERIFIED', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500' },
      { id: 'doc-3', type: 'SALARY_SLIP', fileName: 'salary_slip_july.pdf', status: 'PENDING', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500' },
    ],
    eligibilityResult: {
      score: 88,
      approvalProbability: 92.5,
      maxAmount: 850000,
      dtiRatio: 0.28,
      reason: 'Strong debt-to-income ratio (28%) combined with high credit score (780) and stable employment at TechCorp Solutions.',
      suggestions: ['Instant approval recommended up to $850,000.', 'Verified salary slip confirms regular monthly deposit of $125,000.'],
    },
    riskAssessment: {
      riskLevel: 'LOW',
      riskScore: 18,
      fraudFlags: [],
      isDuplicatePan: false,
      isDuplicateAadhaar: false,
      isSuspiciousIncome: false,
    },
  },
  {
    id: 'LN-2026-99205',
    applicantName: 'Robert Smith',
    email: 'robert.s@example.com',
    productCode: 'BIZ_LOAN',
    productName: 'SME Business Expansion Loan',
    requestedAmount: 2500000,
    tenureMonths: 48,
    interestRate: 12.0,
    monthlyEmi: 65830,
    status: 'OFFICER_APPROVED',
    purpose: 'New Store Location Equipment Purchase',
    monthlyIncome: 320000,
    monthlyExpenses: 110000,
    creditScore: 710,
    panNumber: 'XYZPD9876Q',
    aadhaarNumber: '987654321098',
    employmentType: 'BUSINESS',
    employerName: 'Apex Retail LLC',
    submittedAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    documents: [
      { id: 'doc-4', type: 'PAN', fileName: 'pan_card.pdf', status: 'VERIFIED', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500' },
      { id: 'doc-5', type: 'BANK_STATEMENT', fileName: 'bank_statement_6m.pdf', status: 'VERIFIED', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500' },
    ],
    eligibilityResult: {
      score: 74,
      approvalProbability: 78.0,
      maxAmount: 2800000,
      dtiRatio: 0.34,
      reason: 'SME revenue shows steady growth. Requires Manager approval due to loan threshold exceeding $1,000,000.',
      suggestions: ['High value loan (> $1M): Escalated to Branch Manager David Miller.'],
    },
    riskAssessment: {
      riskLevel: 'MEDIUM',
      riskScore: 42,
      fraudFlags: ['High Loan Amount Alert'],
      isDuplicatePan: false,
      isDuplicateAadhaar: false,
      isSuspiciousIncome: false,
    },
  },
];

// ==========================================
// API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'LoanFlow Platform', version: '1.0.0-PROD' });
});

// Authentication
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const user = mockUsers.find((u) => u.email.toLowerCase() === email?.toLowerCase()) || mockUsers[0];
  res.json({
    token: `mock-jwt-token-for-${user.id}-${Date.now()}`,
    refreshToken: `mock-refresh-token-${user.id}`,
    user,
  });
});

// Loan Products
app.get('/api/products', (req, res) => {
  res.json([
    { id: 1, code: 'PERS_LOAN', name: 'Personal Instant Loan', interestRate: 10.5, minAmount: 10000, maxAmount: 2000000, minTenure: 12, maxTenure: 60, feePct: 1.0 },
    { id: 2, code: 'HOME_LOAN', name: 'Prime Home Purchase Loan', interestRate: 8.4, minAmount: 500000, maxAmount: 25000000, minTenure: 60, maxTenure: 360, feePct: 0.5 },
    { id: 3, code: 'EDU_LOAN', name: 'Global Higher Education Loan', interestRate: 9.2, minAmount: 50000, maxAmount: 5000000, minTenure: 12, maxTenure: 120, feePct: 0.75 },
    { id: 4, code: 'BIZ_LOAN', name: 'SME Business Expansion Loan', interestRate: 12.0, minAmount: 200000, maxAmount: 10000000, minTenure: 12, maxTenure: 84, feePct: 1.25 },
  ]);
});

// List Customer Loans
app.get('/api/loans', (req, res) => {
  res.json(mockLoans);
});

// Submit New Loan Application
app.post('/api/loans/apply', async (req, res) => {
  const payload = req.body;
  const newLoanId = `LN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  const monthlyIncome = Number(payload.monthlyIncome) || 100000;
  const monthlyExpenses = Number(payload.monthlyExpenses) || 30000;
  const requestedAmount = Number(payload.requestedAmount) || 500000;
  const tenureMonths = Number(payload.tenureMonths) || 36;
  const creditScore = Number(payload.creditScore) || 750;

  const dti = ((monthlyExpenses + (requestedAmount / tenureMonths)) / monthlyIncome).toFixed(2);
  const score = Math.min(98, Math.max(30, Math.round((creditScore / 850) * 60 + (1 - Number(dti)) * 40)));
  const probability = (score * 0.95).toFixed(1);

  let aiReason = `Automated eligibility score calculated based on DTI ratio (${dti}) and credit score (${creditScore}).`;
  let suggestions = ['Maintain current debt obligations', 'Provide tax returns for fast-track processing'];

  try {
    const ai = getGeminiAI();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Analyze this loan application and return a JSON evaluation:
Monthly Income: $${monthlyIncome}
Monthly Expenses: $${monthlyExpenses}
Requested Loan Amount: $${requestedAmount}
Tenure: ${tenureMonths} months
Credit Score: ${creditScore}
Employment Type: ${payload.employmentType || 'SALARIED'}

Provide evaluation JSON with fields: score (0-100), maxAmount (number), approvalProbability (number 0-100), reason (string), suggestions (string array).`,
      });

      if (response.text) {
        const text = response.text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(text);
        if (parsed.score) {
          aiReason = parsed.reason;
          suggestions = parsed.suggestions || suggestions;
        }
      }
    }
  } catch (err) {
    console.error('Gemini AI call error:', err);
  }

  const newLoan = {
    id: newLoanId,
    applicantName: payload.applicantName || 'Alex Morgan',
    email: payload.email || 'customer@loanflow.com',
    productCode: payload.productCode || 'PERS_LOAN',
    productName: payload.productName || 'Personal Instant Loan',
    requestedAmount,
    tenureMonths,
    interestRate: 10.5,
    monthlyEmi: Math.round((requestedAmount * 1.1) / tenureMonths),
    status: 'SUBMITTED',
    purpose: payload.purpose || 'General Financing',
    monthlyIncome,
    monthlyExpenses,
    creditScore,
    panNumber: payload.panNumber || 'ABCDE1234F',
    aadhaarNumber: payload.aadhaarNumber || '123456789012',
    employmentType: payload.employmentType || 'SALARIED',
    employerName: payload.employerName || 'TechCorp',
    submittedAt: new Date().toISOString(),
    documents: [],
    eligibilityResult: {
      score,
      approvalProbability: Number(probability),
      maxAmount: Math.round(monthlyIncome * 12 * 0.4),
      dtiRatio: Number(dti),
      reason: aiReason,
      suggestions,
    },
    riskAssessment: {
      riskLevel: score > 75 ? 'LOW' : score > 50 ? 'MEDIUM' : 'HIGH',
      riskScore: 100 - score,
      fraudFlags: [],
      isDuplicatePan: false,
      isDuplicateAadhaar: false,
      isSuspiciousIncome: false,
    },
  };

  mockLoans.unshift(newLoan);
  res.status(201).json(newLoan);
});

// Gemini AI OCR & Fraud Analysis Endpoint
app.post('/api/ai/ocr-extract', async (req, res) => {
  const { docType } = req.body;
  const ai = getGeminiAI();

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Generate simulated OCR field extraction JSON for document type: ${docType}. 
Return valid JSON with key document fields (documentNumber, fullName, dateOfBirth, issuer, verificationStatus: "VERIFIED").`,
      });

      const text = response.text.replace(/```json|```/g, '').trim();
      return res.json(JSON.parse(text));
    } catch (e) {
      console.error('OCR AI generation failed, using fallback', e);
    }
  }

  res.json({
    documentType: docType,
    documentNumber: docType === 'PAN' ? 'ABCDE1234F' : '1234-5678-9012',
    fullName: 'Alex Morgan',
    verificationStatus: 'VERIFIED',
    confidenceScore: 0.98,
  });
});

// Loan Officer & Manager Actions
app.post('/api/officer/decide', (req, res) => {
  const { loanId, decision, comments } = req.body;
  const loan = mockLoans.find((l) => l.id === loanId);
  if (!loan) return res.status(404).json({ error: 'Loan not found' });

  if (decision === 'APPROVE') {
    loan.status = loan.requestedAmount >= 1000000 ? 'OFFICER_APPROVED' : 'SANCTIONED';
  } else if (decision === 'REJECT') {
    loan.status = 'REJECTED';
  } else if (decision === 'MORE_DOCS') {
    loan.status = 'REQUIRES_MORE_DOCS';
  }

  res.json({ success: true, loan });
});

app.post('/api/manager/override', (req, res) => {
  const { loanId, decision } = req.body;
  const loan = mockLoans.find((l) => l.id === loanId);
  if (!loan) return res.status(404).json({ error: 'Loan not found' });

  if (decision === 'APPROVE') {
    loan.status = 'SANCTIONED';
  } else {
    loan.status = 'REJECTED';
  }

  res.json({ success: true, loan });
});

// Manager Portfolio Analytics
app.get('/api/manager/analytics', (req, res) => {
  res.json({
    totalApplications: mockLoans.length + 42,
    totalDisbursedAmount: 18450000,
    approvalRate: 84.2,
    avgProcessingTimeDays: 1.8,
    statusDistribution: [
      { name: 'Submitted', count: 8 },
      { name: 'Under Verification', count: 12 },
      { name: 'Officer Approved', count: 5 },
      { name: 'Sanctioned', count: 18 },
      { name: 'Disbursed', count: 24 },
      { name: 'Rejected', count: 4 },
    ],
    riskDistribution: [
      { level: 'Low Risk', value: 68 },
      { level: 'Medium Risk', value: 24 },
      { level: 'High Risk', value: 8 },
    ],
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
  server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
  appType: 'spa',
});
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LoanFlow Enterprise Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
