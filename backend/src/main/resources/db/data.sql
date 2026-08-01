-- =============================================================================
-- LoanFlow Initial Seed Data (MySQL 8)
-- =============================================================================

USE loanflow_db;

-- 1. SEED ROLES
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_ADMIN', 'System Administrator with full system management permissions'),
(2, 'ROLE_CUSTOMER', 'Loan Applicant customer capable of applying and tracking loans'),
(3, 'ROLE_LOAN_OFFICER', 'Loan Officer responsible for document verification and initial approvals'),
(4, 'ROLE_MANAGER', 'Branch/Regional Manager responsible for high-value approvals and overrides')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- 2. SEED PERMISSIONS
INSERT INTO permissions (id, name, description) VALUES
(1, 'USER_READ', 'View users list and profiles'),
(2, 'USER_WRITE', 'Create, update, and manage users'),
(3, 'LOAN_APPLY', 'Submit new loan application'),
(4, 'LOAN_VERIFY', 'Verify documents and evaluate AI scores'),
(5, 'LOAN_APPROVE', 'Approve standard loan applications'),
(6, 'LOAN_OVERRIDE', 'Manager approval override for high value or escalated loans'),
(7, 'SYSTEM_CONFIG', 'Modify system settings and interest rates'),
(8, 'AUDIT_READ', 'View audit trail logs')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- 3. SEED ROLE PERMISSIONS
INSERT INTO role_permissions (role_id, permission_id) VALUES
-- ADMIN
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8),
-- CUSTOMER
(2, 3),
-- LOAN OFFICER
(3, 1), (3, 4), (3, 5),
-- MANAGER
(4, 1), (4, 4), (4, 5), (4, 6), (4, 8)
ON DUPLICATE KEY UPDATE role_id=VALUES(role_id);

-- 4. SEED USERS (BCrypt hashed password for 'Password123!')
-- $2a$10$e8R..BCryptHashPlaceholderForPassword123!
INSERT INTO users (id, email, password_hash, first_name, last_name, phone_number, is_active, is_email_verified) VALUES
(1, 'admin@loanflow.com', '$2a$10$7R4d22N6j1I2H7rQG0.O8uS3zM.XN4pDkG4P1k7XvP2a9M2a3B4c5', 'System', 'Admin', '+18005550100', TRUE, TRUE),
(2, 'officer@loanflow.com', '$2a$10$7R4d22N6j1I2H7rQG0.O8uS3zM.XN4pDkG4P1k7XvP2a9M2a3B4c5', 'Sarah', 'Jenkins', '+18005550101', TRUE, TRUE),
(3, 'manager@loanflow.com', '$2a$10$7R4d22N6j1I2H7rQG0.O8uS3zM.XN4pDkG4P1k7XvP2a9M2a3B4c5', 'David', 'Miller', '+18005550102', TRUE, TRUE),
(4, 'customer@loanflow.com', '$2a$10$7R4d22N6j1I2H7rQG0.O8uS3zM.XN4pDkG4P1k7XvP2a9M2a3B4c5', 'Alex', 'Morgan', '+18005550103', TRUE, TRUE)
ON DUPLICATE KEY UPDATE first_name=VALUES(first_name);

-- 5. SEED USER ROLES
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- Admin -> ROLE_ADMIN
(2, 3), -- Officer -> ROLE_LOAN_OFFICER
(3, 4), -- Manager -> ROLE_MANAGER
(4, 2)  -- Customer -> ROLE_CUSTOMER
ON DUPLICATE KEY UPDATE user_id=VALUES(user_id);

-- 6. SEED CUSTOMER PROFILE FOR ALEX MORGAN
INSERT INTO customers (id, user_id, pan_number, aadhaar_number, date_of_birth, gender, employment_type, employer_name, monthly_income, monthly_expenses, credit_score, address_line1, city, state, pincode) VALUES
(1, 4, 'ABCDE1234F', '123456789012', '1992-05-15', 'MALE', 'SALARIED', 'TechCorp Solutions', 125000.00, 35000.00, 780, '124 Tech Boulevard, Suite 400', 'San Francisco', 'California', '94105')
ON DUPLICATE KEY UPDATE monthly_income=VALUES(monthly_income);

-- 7. SEED LOAN PRODUCTS
INSERT INTO loan_products (id, code, name, description, interest_rate_annual, min_amount, max_amount, min_tenure_months, max_tenure_months, processing_fee_percentage, is_active) VALUES
(1, 'PERS_LOAN', 'Personal Instant Loan', 'Quick unsecured personal financing for urgent needs and debt consolidation.', 10.50, 10000.00, 2000000.00, 12, 60, 1.00, TRUE),
(2, 'HOME_LOAN', 'Prime Home Purchase Loan', 'Affordable long-term housing finance with competitive interest rates.', 8.40, 500000.00, 25000000.00, 60, 360, 0.50, TRUE),
(3, 'EDU_LOAN', 'Global Higher Education Loan', 'Comprehensive study loans covering tuition, housing, and study materials.', 9.20, 50000.00, 5000000.00, 12, 120, 0.75, TRUE),
(4, 'BIZ_LOAN', 'SME Business Expansion Loan', 'Working capital & capital expenditure loans tailored for registered businesses.', 12.00, 200000.00, 10000000.00, 12, 84, 1.25, TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 8. SEED SYSTEM SETTINGS
INSERT INTO system_settings (id, setting_key, setting_value, description) VALUES
(1, 'HIGH_LOAN_VALUE_THRESHOLD', '1000000', 'Loans equal to or exceeding this amount require Branch Manager approval'),
(2, 'AUTO_AI_ELIGIBILITY_TRIGGER', 'TRUE', 'Automatically trigger Gemini AI risk & eligibility analysis on document upload'),
(3, 'MAX_DEBT_TO_INCOME_RATIO', '0.50', 'Maximum allowed monthly debt commitments to income ratio'),
(4, 'FRAUD_CHECK_STRICT_MODE', 'TRUE', 'Enable strict duplicate PAN/Aadhaar/Phone cross-validation')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);
