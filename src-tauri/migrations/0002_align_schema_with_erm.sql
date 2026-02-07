-- =========================
-- 0002_align_schema_with_erm.sql
-- =========================

-- -------------------------
-- Fiscal Profile
-- -------------------------
CREATE TABLE fiscal_profile (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fiscal_regime VARCHAR(50) NOT NULL,
    requires_saft BOOLEAN NOT NULL DEFAULT FALSE,
    requires_vat BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------
-- Company Partner
-- -------------------------
CREATE TABLE company_partner (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    document_code VARCHAR(50),
    quota_percentage DECIMAL(5,2),
    CONSTRAINT fk_company_partner_company
        FOREIGN KEY (company_id) REFERENCES company(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------
-- Alterações na Company
-- -------------------------
ALTER TABLE company
    ADD COLUMN company_type VARCHAR(50),
    ADD COLUMN fiscal_profile_id BIGINT UNSIGNED,
    ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE company
    ADD CONSTRAINT fk_company_fiscal_profile
        FOREIGN KEY (fiscal_profile_id) REFERENCES fiscal_profile(id);
