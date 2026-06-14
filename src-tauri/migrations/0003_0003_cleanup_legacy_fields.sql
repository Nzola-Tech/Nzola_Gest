-- =========================
-- 0003_cleanup_legacy_fields.sql
-- Nzola Gest - Cleanup legacy fields (MySQL safe)
-- =========================

-- -------------------------
-- Remove coluna 'regime' se existir
-- -------------------------
SET @col_regime := (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'company'
      AND COLUMN_NAME = 'regime'
);

SET @sql_regime := IF(
    @col_regime > 0,
    'ALTER TABLE company DROP COLUMN regime;',
    'SELECT 1;'
);

PREPARE stmt FROM @sql_regime;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- -------------------------
-- Remove coluna 'documentCode' se existir
-- -------------------------
SET @col_document := (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'company'
      AND COLUMN_NAME = 'documentCode'
);

SET @sql_document := IF(
    @col_document > 0,
    'ALTER TABLE company DROP COLUMN documentCode;',
    'SELECT 1;'
);

PREPARE stmt FROM @sql_document;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
