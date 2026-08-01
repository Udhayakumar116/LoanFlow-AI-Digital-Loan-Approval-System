-- =============================================================================
-- LoanFlow - AI-Powered Digital Loan Approval System Database Schema (MySQL 8)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS loanflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE loanflow_db;

-- Disable foreign key checks for table setup
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS loan_decisions;
DROP TABLE IF EXISTS risk_assessments;
DROP TABLE IF EXISTS eligibility_results;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS loan_status_history;
DROP TABLE IF EXISTS loan_applications;
DROP TABLE IF EXISTS loan_products;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS system_settings;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. ROLES TABLE
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- ROLE_ADMIN, ROLE_CUSTOMER, ROLE_LOAN_OFFICER, ROLE_MANAGER
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. PERMISSIONS TABLE
CREATE TABLE permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. ROLE_PERMISSIONS TABLE
CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. USERS TABLE
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    profile_picture_url VARCHAR(500),
    version INT DEFAULT 0, -- Optimistic locking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_phone (phone_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. USER_ROLES MAPPING TABLE
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. REFRESH TOKENS TABLE
CREATE TABLE refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expiry_date TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_token_str (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. CUSTOMERS TABLE
CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    pan_number VARCHAR(10) NOT NULL UNIQUE,
    aadhaar_number VARCHAR(12) NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    employment_type VARCHAR(50) NOT NULL, -- SALARIED, SELF_EMPLOYED, BUSINESS, UNEMPLOYED
    employer_name VARCHAR(100),
    monthly_income DECIMAL(15,2) NOT NULL,
    monthly_expenses DECIMAL(15,2) DEFAULT 0.00,
    credit_score INT DEFAULT 700,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cust_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_cust_pan (pan_number),
    INDEX idx_cust_aadhaar (aadhaar_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. LOAN PRODUCTS TABLE
CREATE TABLE loan_products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    interest_rate_annual DECIMAL(5,2) NOT NULL, -- e.g. 10.50%
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    min_tenure_months INT NOT NULL,
    max_tenure_months INT NOT NULL,
    processing_fee_percentage DECIMAL(5,2) DEFAULT 1.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. LOAN APPLICATIONS TABLE
CREATE TABLE loan_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_number VARCHAR(30) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    loan_product_id BIGINT NOT NULL,
    requested_amount DECIMAL(15,2) NOT NULL,
    approved_amount DECIMAL(15,2),
    tenure_months INT NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    monthly_emi DECIMAL(15,2),
    status VARCHAR(50) NOT NULL, -- SUBMITTED, DOCUMENT_VERIFICATION, AI_ELIGIBILITY_PASSED, FRAUD_CHECK_PASSED, RISK_ASSESSED, OFFICER_APPROVED, MANAGER_APPROVED, SANCTIONED, DISBURSED, REJECTED, CANCELLED, REQUIRES_MORE_DOCS
    purpose VARCHAR(255),
    assigned_officer_id BIGINT,
    version INT DEFAULT 0, -- Optimistic Locking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_customer FOREIGN KEY (customer_id) REFERENCES customers (id),
    CONSTRAINT fk_app_product FOREIGN KEY (loan_product_id) REFERENCES loan_products (id),
    CONSTRAINT fk_app_officer FOREIGN KEY (assigned_officer_id) REFERENCES users (id),
    INDEX idx_app_number (application_number),
    INDEX idx_app_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. LOAN STATUS HISTORY TABLE
CREATE TABLE loan_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    loan_application_id BIGINT NOT NULL,
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    remarks TEXT,
    changed_by_user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lsh_app FOREIGN KEY (loan_application_id) REFERENCES loan_applications (id) ON DELETE CASCADE,
    CONSTRAINT fk_lsh_user FOREIGN KEY (changed_by_user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. DOCUMENTS TABLE
CREATE TABLE documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    loan_application_id BIGINT NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- AADHAAR, PAN, SALARY_SLIP, BANK_STATEMENT, PROFILE_PHOTO
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    cloudinary_public_id VARCHAR(255),
    verification_status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, VERIFIED, REJECTED
    ocr_extracted_json JSON,
    verified_by_user_id BIGINT,
    verification_remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_doc_app FOREIGN KEY (loan_application_id) REFERENCES loan_applications (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. ELIGIBILITY RESULTS TABLE (AI-Powered)
CREATE TABLE eligibility_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    loan_application_id BIGINT NOT NULL UNIQUE,
    eligibility_score INT NOT NULL, -- 0 to 100
    approval_probability DECIMAL(5,2) NOT NULL, -- Percentage
    max_eligible_amount DECIMAL(15,2) NOT NULL,
    debt_to_income_ratio DECIMAL(5,2) NOT NULL,
    ai_reason TEXT,
    ai_suggestions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_el_app FOREIGN KEY (loan_application_id) REFERENCES loan_applications (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. RISK ASSESSMENTS TABLE
CREATE TABLE risk_assessments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    loan_application_id BIGINT NOT NULL UNIQUE,
    risk_level VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, VERY_HIGH
    risk_score INT NOT NULL, -- 0 to 100
    fraud_flags JSON,
    is_duplicate_pan BOOLEAN DEFAULT FALSE,
    is_duplicate_aadhaar BOOLEAN DEFAULT FALSE,
    is_suspicious_income BOOLEAN DEFAULT FALSE,
    rule_evaluation_summary JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_risk_app FOREIGN KEY (loan_application_id) REFERENCES loan_applications (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. LOAN DECISIONS TABLE
CREATE TABLE loan_decisions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    loan_application_id BIGINT NOT NULL,
    decision VARCHAR(30) NOT NULL, -- APPROVED, REJECTED, MORE_DOCUMENTS_REQUIRED, OVERRIDDEN
    decision_by_role VARCHAR(30) NOT NULL, -- LOAN_OFFICER, MANAGER
    decided_by_user_id BIGINT NOT NULL,
    comments TEXT,
    is_manager_override BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dec_app FOREIGN KEY (loan_application_id) REFERENCES loan_applications (id) ON DELETE CASCADE,
    CONSTRAINT fk_dec_user FOREIGN KEY (decided_by_user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. PAYMENTS TABLE
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    loan_application_id BIGINT NOT NULL,
    transaction_reference VARCHAR(100) NOT NULL UNIQUE,
    emi_number INT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50) NOT NULL, -- NET_BANKING, UPI, DEBIT_CARD, AUTO_DEBIT
    status VARCHAR(30) NOT NULL, -- SUCCESS, FAILED, PENDING
    CONSTRAINT fk_pay_app FOREIGN KEY (loan_application_id) REFERENCES loan_applications (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- APPLICATION_SUBMITTED, DOC_REQUIRED, APPROVED, REJECTED, EMI_REMINDER
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id BIGINT,
    details JSON,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_action (action),
    INDEX idx_audit_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 18. SYSTEM SETTINGS TABLE
CREATE TABLE system_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description VARCHAR(255),
    updated_by_user_id BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
