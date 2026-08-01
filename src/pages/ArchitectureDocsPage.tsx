import React, { useState } from 'react';
import { Code2, Server, Database, Layers, CheckCircle, FileText, Shield } from 'lucide-react';

export const ArchitectureDocsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'folder' | 'database' | 'api'>('architecture');

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <Code2 className="w-3.5 h-3.5" />
          <span>System Architecture & Technical Specifications</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">LoanFlow Technical Architecture</h1>
        <p className="text-xs text-slate-400">Clean Architecture, Spring Boot 3 Java 21 backend structure, MySQL 8 database schema, and OpenAPI specifications.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'architecture' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Clean Architecture</span>
        </button>
        <button
          onClick={() => setActiveTab('folder')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'folder' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Spring Boot Folder Structure</span>
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'database' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>MySQL Schema & ERD</span>
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'api' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>REST API Contracts</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'architecture' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 text-slate-300 text-xs leading-relaxed">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>Clean Architecture & Domain Driven Design</span>
          </h2>

          <div className="p-4 rounded-xl bg-slate-950 font-mono text-[11px] border border-slate-800 text-blue-300 whitespace-pre overflow-x-auto">
{`+-----------------------------------------------------------------------------------+
|                                Controller Layer                                   |
|   (REST Endpoint, DTO Validation, Swagger Specs, Response Formatting)             |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                                 Service Layer                                     |
|  (Business Rules, Gemini AI Integration, OCR Engine, Risk Evaluation)            |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                                Repository Layer                                   |
|    (Spring Data JPA, Hibernate ORM, Native Queries, Optimistic Locking)          |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                                MySQL 8 Database                                   |
| (18 Normalized Tables, FK Constraints, Audit Trail, Indices & Views)             |
+-----------------------------------------------------------------------------------+`}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h3 className="font-bold text-white">SOLID Principles Compliance</h3>
              <ul className="space-y-1 list-disc list-inside text-slate-400">
                <li>Single Responsibility Principle in Service implementations.</li>
                <li>Open/Closed Principle for extensible Risk Engines.</li>
                <li>Dependency Injection via Spring `@Autowired` / Constructor.</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h3 className="font-bold text-white">Security Specs</h3>
              <ul className="space-y-1 list-disc list-inside text-slate-400">
                <li>Spring Security 6 with JWT Stateless Sessions.</li>
                <li>BCrypt 10-round salted password hashing.</li>
                <li>Role-Based Access Control (RBAC) across 4 roles.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'folder' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white">Java Spring Boot 3 Folder & Package Tree</h2>
          <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-slate-800">
{`backend/
├── pom.xml (Java 21, Spring Boot 3.3.x, MySQL, JWT, Tesseract, Lombok)
├── Dockerfile (Multi-stage build)
└── src/
    ├── main/
    │   ├── java/com/loanflow/
    │   │   ├── LoanFlowApplication.java
    │   │   ├── config/
    │   │   │   ├── SecurityConfig.java
    │   │   │   ├── JwtAuthenticationFilter.java
    │   │   │   └── OpenAPIConfig.java
    │   │   ├── controller/
    │   │   │   ├── AuthController.java
    │   │   │   ├── CustomerLoanController.java
    │   │   │   ├── OfficerReviewController.java
    │   │   │   ├── ManagerApprovalController.java
    │   │   │   └── AdminSystemController.java
    │   │   ├── dto/
    │   │   │   ├── request/
    │   │   │   └── response/
    │   │   ├── entity/
    │   │   │   ├── User.java
    │   │   │   ├── Customer.java
    │   │   │   ├── LoanApplication.java
    │   │   │   ├── Document.java
    │   │   │   └── EligibilityResult.java
    │   │   ├── repository/
    │   │   └── service/
    │   │       ├── impl/
    │   │       ├── LoanEligibilityService.java
    │   │       ├── FraudDetectionService.java
    │   │       └── DocumentOCRService.java
    │   └── resources/
    │       ├── application.yml
    │       └── db/
    │           ├── schema.sql
    │           └── data.sql`}
          </pre>
        </div>
      )}

      {activeTab === 'database' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white">MySQL 8 Database Normalized Schema (18 Tables)</h2>
          <pre className="p-4 rounded-xl bg-slate-950 text-sky-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
{`Tables Included:
1. users                 - System user credentials & status
2. roles                 - Role definitions (ROLE_CUSTOMER, ROLE_LOAN_OFFICER, etc.)
3. permissions           - Granular security permissions
4. role_permissions      - Role to permissions mapping
5. user_roles            - User to roles mapping
6. customers             - Customer profiles (PAN, Aadhaar, Income, Credit Score)
7. loan_products         - Products (Personal, Home, Education, Business)
8. loan_applications     - Main loan application record & state
9. loan_status_history   - Historical state transitions & remarks
10. documents            - Uploaded document URLs & OCR JSON
11. eligibility_results  - Gemini AI eligibility scores & reason
12. risk_assessments     - Fraud flags & risk scoring (LOW, MEDIUM, HIGH)
13. loan_decisions       - Officer & Manager decisions & overrides
14. payments             - Disbursement & EMI payment records
15. notifications        - Real-time customer alerts
16. audit_logs           - Security & operational audit trail
17. refresh_tokens       - JWT refresh token storage
18. system_settings      - Dynamic system threshold parameters`}
          </pre>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white">REST API Endpoints</h2>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="font-mono text-emerald-400 font-bold">POST /api/v1/auth/login</span>
              <span className="text-slate-400">JWT Token Authentication</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="font-mono text-blue-400 font-bold">POST /api/v1/customer/loans/apply</span>
              <span className="text-slate-400">Submit New Loan Application</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="font-mono text-purple-400 font-bold">POST /api/v1/ai/eligibility-predict</span>
              <span className="text-slate-400">Gemini AI Model Evaluation</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="font-mono text-amber-400 font-bold">POST /api/v1/officer/applications/{'{id}'}/decision</span>
              <span className="text-slate-400">Loan Officer Approval Action</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
