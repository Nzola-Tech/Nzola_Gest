-- =========================
-- 0001_initial_schema.sql
-- Nzola Gest - Initial Schema
-- =========================

-- -------------------------
-- Tabela: users
-- -------------------------
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'RESET', 'USER') NOT NULL DEFAULT 'USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------
-- Tabela: products
-- -------------------------
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    expiration_date DATE,
    stock_quantity INT DEFAULT 0,
    sale_price DECIMAL(15,2),
    category VARCHAR(100),
    deleted BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------
-- Tabela: sales
-- -------------------------
CREATE TABLE sales (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED,
    subtotal DECIMAL(15,2),
    discount_total DECIMAL(15,2) DEFAULT 0,
    total DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sales_user
      FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------
-- Tabela: sale_items
-- -------------------------
CREATE TABLE sale_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sale_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(15,2),
    discount_type VARCHAR(20),
    discount_value DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    subtotal DECIMAL(15,2),
    total DECIMAL(15,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sale_items_sale
      FOREIGN KEY (sale_id) REFERENCES sales(id),
    CONSTRAINT fk_sale_items_product
      FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------
-- Tabela: company
-- -------------------------
CREATE TABLE company (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    documentCode VARCHAR(50),
    regime VARCHAR(50),
    nif VARCHAR(50) NOT NULL,
    website VARCHAR(150),
    phone VARCHAR(50) NOT NULL,
    tradeRegister VARCHAR(100),
    province VARCHAR(100),
    municipality VARCHAR(100),
    street VARCHAR(150),
    neighborhood VARCHAR(150),
    building VARCHAR(150),
    logo TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------
-- Usuário ADMIN inicial
-- -------------------------
INSERT INTO users (
    username,
    name,
    surname,
    email,
    password_hash,
    role,
    is_active
) VALUES (
    'admin',
    'Administrador',
    'Sistema',
    'admin@nzola.local',
    '$2b$12$Q6v0Rr9j8X6YqH8vX0U4uO9ZyEJ8q1n6ZJ6zU0QKZpQ1xPz5ZzZyG',
    'ADMIN',
    TRUE
);

-- -------------------------
-- Usuário de RESET / emergência
-- -------------------------
INSERT INTO users (
    username,
    name,
    surname,
    email,
    password_hash,
    role,
    is_active
) VALUES (
    'reset',
    'Reset',
    'System',
    'aldairandre99@gmail.com',
    '$2b$12$0xk1KZ6QyFJY8Z8Z2LxWnOeU5mP1vZB6D9ZzYQnQJ2mY3pPZy2n2G',
    'RESET',
    TRUE
);
