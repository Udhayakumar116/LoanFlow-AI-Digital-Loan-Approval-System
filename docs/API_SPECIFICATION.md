# LoanFlow REST API Specification

Base URL: `http://localhost:8080/api/v1` (Spring Boot Backend) or `http://localhost:3000/api` (Web Dev Gateway)

## 1. Authentication APIs (`/auth`)
- `POST /auth/register`: Register new customer user account.
- `POST /auth/login`: Authenticate credentials, receive JWT access token + refresh token.
- `POST /auth/refresh-token`: Refresh expired JWT access token using refresh token.
- `POST /auth/forgot-password`: Request password reset OTP email.
- `POST /auth/reset-password`: Reset password using OTP token.
- `GET /auth/me`: Get current authenticated user profile and roles.

## 2. Customer APIs (`/customer`)
- `GET /customer/products`: List available active loan products with interest rates and tenure limits.
- `POST /customer/loans/apply`: Submit a new loan application.
- `POST /customer/loans/{id}/documents`: Upload document (Aadhaar, PAN, Salary Slip, Bank Statement).
- `GET /customer/loans`: List customer's loan applications history with live status.
- `GET /customer/loans/{id}`: Get loan application detail with status timeline and sanction letter download.
- `POST /customer/loans/{id}/cancel`: Cancel a submitted loan application before approval.
- `POST /customer/emi/calculate`: EMI calculator simulation endpoint.

## 3. Loan Officer APIs (`/officer`)
- `GET /officer/applications`: List loan applications assigned for verification (with pagination, status filter, sorting).
- `GET /officer/applications/{id}`: Get full loan detail including OCR documents, AI eligibility, risk flags.
- `POST /officer/documents/{docId}/verify`: Approve or reject uploaded document after OCR verification.
- `POST /officer/applications/{id}/ai-evaluate`: Trigger AI eligibility prediction and risk evaluation.
- `POST /officer/applications/{id}/decision`: Submit officer decision (APPROVE, REJECT, REQUEST_MORE_DOCS).

## 4. Manager APIs (`/manager`)
- `GET /manager/pending-approvals`: List high-value or escalated loan applications requiring manager review.
- `POST /manager/applications/{id}/override-decision`: Manager override decision (APPROVE high-value loan, OVERRIDE REJECTION).
- `GET /manager/analytics`: Executive portfolio analytics (approval rates, risk distribution, disbursement metrics).

## 5. Admin APIs (`/admin`)
- `GET /admin/users`: List system users with roles and status.
- `PUT /admin/users/{id}/roles`: Update user roles and status.
- `GET /admin/products`: CRUD loan products and set interest rates.
- `POST /admin/products`: Create or update loan products.
- `GET /admin/audit-logs`: Query system audit trail logs.
- `GET /admin/settings`: View and update system configuration parameters.

## 6. AI & Utility APIs (`/ai`)
- `POST /ai/eligibility-predict`: Gemini AI model loan eligibility scoring & feedback.
- `POST /ai/ocr-extract`: Extract fields from document image/PDF via Tesseract & Gemini vision fallback.
- `POST /ai/fraud-check`: Fraud detection scan cross-referencing PAN, Aadhaar, email, and income anomalies.
