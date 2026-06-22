# 🏥 Nzola Gest

**Nzola Gest** is a desktop management system designed to support business operations in a simple, fast, and reliable way.

It is built with a modern full-stack architecture using **Rust (Tauri)** for the backend, **Vite + TypeScript** for the frontend, and **MySQL (Docker)** for data persistence.

---

## 🎯 Purpose

The goal of Nzola Gest is to provide an efficient system for managing:

- 📦 Products and inventory
- 💰 Sales and transactions
- 📊 Business operations and reporting
- 👤 Users and access control (future feature)

---

## ⚙️ Key Features

- ⚡ Fast desktop application (Tauri)
- 🧱 Clean architecture backend in Rust
- 🐳 Containerized MySQL database
- 🔄 Database migrations with SQLx
- 📱 Modern and responsive UI (Vite + TypeScript)

---

## 🧠 Philosophy

Nzola Gest is designed with simplicity, performance, and scalability in mind, focusing on real-world business needs while keeping the system lightweight and maintainable.

---

## 🚀 Status

This project is currently in active development and evolving towards a complete production-ready management system.

## 🚀 Overview

This project provides:
- ⚛️ React (Frontend)
- 🐳 MySQL database running in Docker
- 🦀 Rust backend (clean architecture)
- 🧱 SQLx migrations system
- ⚙️ Environment-based configuration (`.env`)
- 🔄 Reproducible development environment

---

## 📦 Tech Stack

- Typescript
- Tailwind Css
- Rust (Backend)
- SQLx (ORM + Migrations)
- MySQL 8.0
- Docker & Docker Compose
- dotenv (.env configuration)

---

# 🐳 Database configuration

⚙️ Environment Setup

Create a .env file in the root directory:

- MYSQL_DATABASE=nzola_gest
- MYSQL_USER=root
- MYSQL_ROOT_PASSWORD=root

- PMA_HOST=db

- APP_PORT=8080
- DB_PORT=3306

- DATABASE_URL=mysql://root:root@localhost:3306/nzola_gest

# 💻 Run in Development Mode

Start the full Tauri app in dev mode:

Start MySQL container:

```
    docker compose up -d
```

# 🧱 Run Migrations

Apply database migrations:

```
    sqlx migrate run
```

# 💻 Run in Development Mode

Start the full Tauri app in dev mode:

```
    pnpm tauri:dev
```