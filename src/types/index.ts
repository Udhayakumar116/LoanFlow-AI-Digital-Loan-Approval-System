// LoanFlow Core Domain Types and DTO Interfaces

export type UserRole = 'ROLE_CUSTOMER' | 'ROLE_LOAN_OFFICER' | 'ROLE_MANAGER' | 'ROLE_ADMIN';

export type ApplicationStatus =
  | 'SUBMITTED'
  | 'DOCUMENT_VERIFICATION'
  | 'AI_EVALUATING'
  | 'OFFICER_APPROVED'
  | 'MANAGER_APPROVED'
  | 'SANCTIONED'
  | 'DISBURSED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'REQUIRES_MORE_DOCS';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  active: boolean;
  profilePictureUrl?: string;
}

export interface CustomerProfile {
  id: number;
  userId: number;
  panNumber: string;
  aadhaarNumber: string;
  dateOfBirth: string;
  gender: string;
  employmentType: 'SALARIED' | 'SELF_EMPLOYED' | 'BUSINESS' | 'UNEMPLOYED';
  employerName: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  creditScore: number;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
}

export interface LoanProduct {
  id: number;
  code: string;
  name: string;
  description?: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  minTenure: number;
  maxTenure: number;
  feePct: number;
}

export interface Document {
  id: string;
  type: 'PAN' | 'AADHAAR' | 'SALARY_SLIP' | 'BANK_STATEMENT' | 'PROFILE_PHOTO';
  fileName: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  url: string;
  ocrExtractedData?: Record<string, any>;
}

export interface EligibilityResult {
  score: number;
  approvalProbability: number;
  maxAmount: number;
  dtiRatio: number;
  reason: string;
  suggestions: string[];
}

export interface RiskAssessment {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  riskScore: number;
  fraudFlags: string[];
  isDuplicatePan: boolean;
  isDuplicateAadhaar: boolean;
  isSuspiciousIncome: boolean;
}

export interface LoanApplication {
  id: string;
  applicantName: string;
  email: string;
  productCode: string;
  productName: string;
  requestedAmount: number;
  approvedAmount?: number;
  tenureMonths: number;
  interestRate: number;
  monthlyEmi: number;
  status: ApplicationStatus;
  purpose: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  creditScore: number;
  panNumber: string;
  aadhaarNumber: string;
  employmentType: string;
  employerName: string;
  submittedAt: string;
  documents: Document[];
  eligibilityResult: EligibilityResult;
  riskAssessment: RiskAssessment;
}

export interface ManagerAnalytics {
  totalApplications: number;
  totalDisbursedAmount: number;
  approvalRate: number;
  avgProcessingTimeDays: number;
  statusDistribution: { name: string; count: number }[];
  riskDistribution: { level: string; value: number }[];
}
