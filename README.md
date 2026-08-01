# LoanFlow – AI-Powered Digital Loan Approval System

An enterprise-grade, portfolio-quality **Digital Loan Approval System** built using **Java 21, Spring Boot 3.3.x, MySQL 8, React 19, Vite, Tailwind CSS**, and **Google Gemini AI**.

---

## 🌟 Key Features

- **Multi-Role Workflows**: Tailored portals for **Customer**, **Loan Officer**, **Branch Manager**, and **System Admin**.
- **Gemini AI Credit Eligibility**: Automated risk scoring, debt-to-income (DTI) analysis, and approval probability predictions.
- **AI OCR Document Scanning**: Automated data extraction from Aadhaar, PAN, salary slips, and bank statements.
- **Multi-tier Approval Engine**: Automated routing for standard loans; manager escalation for loans $\ge$ $1,000,000.
- **Sanction Letter Generation**: Instant downloadable PDF sanction letters for approved loans.
- **Interactive EMI Calculator**: Real-time repayment breakdown and amortization schedule.
- **Enterprise Security**: Spring Security, JWT authentication, BCrypt hashing, and Role-Based Access Control (RBAC).

---

## 🏗️ Architecture & Tech Stack

### Backend (Java 21 & Spring Boot 3.3.x)
- **Clean Layered Architecture**: Controller $\rightarrow$ DTO $\rightarrow$ Service $\rightarrow$ Repository $\rightarrow$ Database.
- **Database**: MySQL 8 normalized database with 18 tables, foreign keys, and optimistic locking.
- **Documentation**: OpenAPI / Swagger UI specs (`/swagger-ui.html`).

### Frontend (React 19 & Vite)
- **Styling**: Tailwind CSS with responsive dark layout.
- **State & Context**: AuthContext supporting instant role switching for demonstration.
- **Icons**: Lucide React.

### Deployment & CI/CD
- **Docker**: `docker-compose.yml` orchestrating MySQL 8, Spring Boot Backend, React Frontend, and Adminer DB UI.
- **GitHub Actions**: Automated CI/CD pipeline verifying Java compilation, tests, and Docker builds.

---

## 🚀 Quick Start Guide

### Running with Docker Compose
```bash
docker compose up --build
```
- **Web App**: `http://localhost:3000`
- **Spring Boot API**: `http://localhost:8080/api/v1`
- **Adminer DB Management**: `http://localhost:8081`

### Running Backend Standalone (Maven)
```bash
cd backend
mvn clean spring-boot:run
```

### Running Frontend Standalone (Node.js)
```bash
npm install
npm run dev
```

---

## 🔐 Demo Credentials & Roles

Switch roles instantly using the top bar **Role Persona** dropdown:
- **Customer**: `customer@loanflow.com` (Alex Morgan)
- **Loan Officer**: `officer@loanflow.com` (Sarah Jenkins)
- **Branch Manager**: `manager@loanflow.com` (David Miller)
- **System Admin**: `admin@loanflow.com` (System Admin)
