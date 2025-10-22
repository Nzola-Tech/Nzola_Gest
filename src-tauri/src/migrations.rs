use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                expiration_date DATE,
                stock_quantity INTEGER DEFAULT 0,
                sale_price REAL,
                category TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 7,
            description: "add_products",
            sql: "INSERT INTO products (name, description, expiration_date, stock_quantity, sale_price, category)
            VALUES
            ('Paracetamol 500mg', 'Analgésico e antipirético', '2026-05-10', 150, 500, 'Medicamentos'),
            ('Ibuprofeno 400mg', 'Anti-inflamatório não esteroidal', '2026-03-15', 200, 500, 'Medicamentos'),
            ('Dipirona Sódica 1g', 'Analgésico e antitérmico', '2026-07-01', 300, 2500, 'Medicamentos'),
            ('Álcool 70%', 'Antisséptico líquido', '2028-01-20', 500, 500, 'Higiene'),
            ('Soro Fisiológico 500ml', 'Solução para limpeza e hidratação nasal', '2027-09-05', 100, 1000, 'Higiene'),
            ('Máscara Cirúrgica', 'Máscara descartável tripla camada', '2028-12-31', 1000, 1000, 'Proteção'),
            ('Luvas de Látex M', 'Luvas descartáveis para procedimentos', '2028-11-20', 600, 100, 'Proteção'),
            ('Amoxicilina 500mg', 'Antibiótico para infecções bacterianas', '2026-04-30', 120, 1000, 'Medicamentos'),
            ('Omeprazol 20mg', 'Inibidor da bomba de prótons', '2026-09-10', 180, 1000, 'Medicamentos'),
            ('Vitamina C 500mg', 'Suplemento vitamínico', '2027-06-15', 250, 300, 'Suplementos'),
            ('Shampoo Anticaspa', 'Controle de caspa e oleosidade', '2028-08-12', 90, 10000, 'Higiene'),
            ('Creme Hidratante 200ml', 'Hidratação intensiva para pele seca', '2029-02-25', 140, 7000, 'Cosméticos'),
            ('Protetor Solar FPS 50', 'Proteção solar para pele', '2028-11-30', 80, 5000, 'Cosméticos'),
            ('Escova Dental Macia', 'Escova dental com cerdas macias', '2029-05-18', 500, 300, 'Higiene'),
            ('Fita Microporosa', 'Fita adesiva para curativos', '2029-07-10', 300, 2000, 'Curativos'),
            ('Curativo Adesivo', 'Curativo impermeável', '2029-08-01', 400, 1000, 'Curativos'),
            ('Solução de Iodo 10%', 'Antisséptico tópico', '2027-04-12', 60, 9000, 'Higiene'),
            ('Pomada Antibiótica', 'Pomada para tratamento de feridas', '2027-12-22', 85, 8000, 'Medicamentos'),
            ('Termômetro Digital', 'Termômetro clínico de alta precisão', '2030-01-15', 70, 15000, 'Acessórios'),
            ('Gaze Esterilizada', 'Pacote com 10 unidades', '2029-06-01', 350, 3000, 'Curativos');
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_initial_tables",
            sql: "CREATE TABLE IF NOT EXISTS sales (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                total REAL NOT NULL,
                payment_method TEXT NOT NULL,
                created_at TEXT NOT NULL
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create_initial_tables",
            sql: "CREATE TABLE IF NOT EXISTS sale_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sale_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (sale_id) REFERENCES sales(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "add_deleted_column_to_products",
            sql: "ALTER TABLE products ADD COLUMN deleted BOOLEAN DEFAULT 0;",
            kind: MigrationKind::Up,
        },
        // Criação da tabela users
        Migration {
            version: 5,
            description: "create_users_table",
            sql: r#"
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL UNIQUE,
                    name TEXT NOT NULL,
                    surname TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    role TEXT NOT NULL DEFAULT 'user',
                    status TEXT NOT NULL DEFAULT 'inactive',
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
            "#
            .into(),
            kind: MigrationKind::Up,
        },
        // Seed inicial
        Migration {
            version: 6,
            description: "seed_users",
            sql: r#"
                INSERT INTO users (username, name, surname, email, password, role)
                VALUES
                    ('admin', 'Admin', 'User', 'admin@example.com', '$2b$10$Go1qmK3kb7qqsrTDYuYttO1cEcot1I5GkSbfTvwgAwqFZEMIvTa0q','admin'),
                    ('adminReset', 'Admin', 'Reset', 'aldairandre99@gmail.com', '$2b$10$Go1qmK3kb7qqsrTDYuYttO1cEcot1I5GkSbfTvwgAwqFZEMIvTa0q','admin');
            "#
            .into(),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 8,
            description: "seed_company",
            sql: r#"
                CREATE TABLE IF NOT EXISTS company (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    nif TEXT,
                    location TEXT,
                    phone TEXT,
                    email TEXT
                );
            "#
            .into(),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 9,
            description: "add_missing_company_fields",
            sql: r#"
                ALTER TABLE company ADD COLUMN documentCode TEXT;
                ALTER TABLE company ADD COLUMN regime TEXT;
                ALTER TABLE company ADD COLUMN website TEXT;
                ALTER TABLE company ADD COLUMN tradeRegister TEXT;
                ALTER TABLE company ADD COLUMN province TEXT;
                ALTER TABLE company ADD COLUMN municipality TEXT;
                ALTER TABLE company ADD COLUMN street TEXT;
                ALTER TABLE company ADD COLUMN neighborhood TEXT;
                ALTER TABLE company ADD COLUMN building TEXT;
                ALTER TABLE company ADD COLUMN logo TEXT;
            "#
            .into(),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 10, // nova versão da migration
            description: "drop_and_recreate_company",
            sql: r#"
                DROP TABLE IF EXISTS company;

                CREATE TABLE company (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    documentCode TEXT,
                    regime TEXT,
                    nif TEXT NOT NULL,
                    website TEXT,
                    phone TEXT NOT NULL,
                    tradeRegister TEXT,
                    province TEXT,
                    municipality TEXT,
                    street TEXT,
                    neighborhood TEXT,
                    building TEXT,
                    logo TEXT
                );
                "#.into(),
                kind: MigrationKind::Up,
            },
    ]
}
