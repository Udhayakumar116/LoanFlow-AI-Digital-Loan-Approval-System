# LoanFlow System Architecture & Technical Specifications

## 1. System Overview
**LoanFlow** is an enterprise-grade digital loan approval system designed using **Clean Architecture** principles and **Domain-Driven Design (DDD)**. It features AI-powered credit eligibility scoring, automated document OCR extraction, fraud detection cross-checks, and multi-tier decision workflows across Customer, Loan Officer, Manager, and Admin roles.

```
+-------------------------------------------------------------------------------+
|                                  USER CLIENTS                                 |
|               (React 19, Vite, Tailwind CSS, Responsive Web UI)               |
+---------------------------------------+---------------------------------------+
                                        |
                                  HTTPS / REST
                                        |
+---------------------------------------v---------------------------------------+
|                              API GATEWAY / SECURITY                           |
|      (Spring Security, JWT Auth, Role-Based Access Control, CORS, CSRF)       |
+---------------------------------------+---------------------------------------+
                                        |
+---------------------------------------v---------------------------------------+
|                               CONTROLLER LAYER                                |
|    (AuthController, LoanController, DocumentController, AIController, etc.)   |
+---------------------------------------+---------------------------------------+
                                        |
+---------------------------------------v---------------------------------------+
|                                SERVICE LAYER                                  |
|   (LoanEligibilityService, FraudDetectionService, DocumentOCRService, etc.)   |
+---------------------------------------+---------------------------------------+
                                        |
+-------------------+-------------------+-------------------+-------------------+
|                   |                   |                   |                   |
v                   v                   v                   v                   v
+---------------+ +---------------+ +---------------+ +---------------+ +---------------+
|  DATA ACCESS  | |  GEMINI AI    | | CLOUDINARY    | | TESSERACT OCR | | SPRING MAIL   |
| (JPA/MySQL 8) | |  INTEGRATION  | | FILE STORAGE  | | ENGINE        | | NOTIFICATIONS |
+---------------+ +---------------+ +---------------+ +---------------+ +---------------+
```

## 2. Layered Architecture Breakdown

Each layer strictly respects boundaries:

1. **Controller Layer (`com.loanflow.controller`)**:
   - Handles REST HTTP requests, path variables, query parameters, and JSON payloads.
   - Applies `@Valid` request validation.
   - Delegates business execution directly to the Service Layer.
   - Returns standard `ResponseEntity<ApiResponse<T>>`.

2. **DTO Layer (`com.loanflow.dto`)**:
   - Decouples API contract from internal JPA Entities.
   - Separate Request DTOs and Response DTOs.
   - Utilizes MapStruct for zero-overhead boilerplate-free entity mapping.

3. **Service Layer (`com.loanflow.service`)**:
   - Contains core business logic, status state transitions, and workflow checks.
   - Enforces transactional boundaries (`@Transactional`).
   - Executes Gemini AI models for eligibility scoring and fraud flag analysis.

4. **Repository Layer (`com.loanflow.repository`)**:
   - Extends `JpaRepository<T, ID>` with custom JPQL/Native SQL queries.
   - Supports paginated and filtered searches.

5. **Database Layer (MySQL 8)**:
   - Acid compliant relational storage.
   - Foreign key constraints, optimistic locking (`version`), soft deletion, audit logs.

## 3. Workflow State Machine

```
              +---------------------+
              |      SUBMITTED      |
              +----------+----------+
                         |
                         v
              +---------------------+
              | DOCUMENT_VERIFYING  |
              +----------+----------+
                         |
            (OCR & Fraud Checks Passed)
                         v
              +---------------------+
              |   AI_EVALUATING     |
              +----------+----------+
                         |
                         v
              +---------------------+
              | OFFICER_REVIEWING   |
              +----+-----------+----+
                   |           |
     (Officer Approves)     (Requests Docs)
                   |           |
                   v           v
    Amount >= $1M?           +-----------------------+
    +-----+----+             | REQUIRES_MORE_DOCS    |
    |          |             +-----------------------+
   Yes         No
    |          |
    v          v
+-------+  +-------+
| MANAGER|  |SANCTIONED|
| REVIEW |  +---+---+
+---+---+      |
    |          v
    v      +-------+
(Approved) |DISBURSED|
    |      +-------+
    v
+-------+
|SANCTIONED|
+-------+
```
