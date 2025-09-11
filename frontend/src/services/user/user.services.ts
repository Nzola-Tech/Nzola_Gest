// users.service.ts
import Database from "@tauri-apps/plugin-sql";
import bcrypt from "bcryptjs";

import { User } from "@/types/signup";

export const getUsers = async (db: Database | null): Promise<User[]> => {
  if (!db) return [];

  return await db.select<User[]>(
    "SELECT id, username, role, status, created_at FROM users",
  );
};

export const getUserByUsername = async (
  db: Database | null,
  username: string,
): Promise<User | null> => {
  if (!db) return null;
  const result = await db.select<User[]>(
    "SELECT * FROM users WHERE username = ?",
    [username],
  );

  return result.length > 0 ? result[0] : null;
};

export const createUser = async (
  db: Database | null,
  user: Omit<User, "id">,
) => {
  if (!db) throw new Error("Banco de dados não inicializado");

  // Gera hash da senha usando bcryptjs (10 salt rounds)
  const hashedPassword = bcrypt.hashSync(user.password, 10);

  // Verifica se o usuário já existe
  const exists = await db.select<User[]>(
    "SELECT * FROM users WHERE username = ?",
    [user.username],
  );

  if (exists.length > 0) {
    throw new Error("Usuário já existe");
  }

  // Insere o novo usuário no banco
  await db.execute(
    `INSERT INTO users (username, password, role, created_at, updated_at) 
     VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [
      user.username,
      hashedPassword, // grava o hash no banco
      user.role,
      user.status,
    ],
  );

  return true;
};

export const updateUser = async (
  db: Database | null,
  id: number,
  user: Partial<Pick<User, "username" | "password" | "role">>,
) => {
  if (!db) throw new Error("Banco de dados não inicializado");

  let query = "UPDATE users SET username = ?, role = ?";
  const params: (string | number)[] = [user.username!, user.role!];

  if (user.password && user.password.trim() !== "") {
    query += ", password = ?";
    params.push(user.password);
  }

  query += " WHERE id = ?";
  params.push(id);

  await db.execute(query, params);
};

// Deletar usuário
export const deleteUser = async (db: Database | null, id: number) => {
  if (!db) throw new Error("Banco de dados não inicializado");
  await db.execute("DELETE FROM users WHERE id = ?", [id]);

  return true;
};

export const hashpassword = (password: string) => bcrypt.hashSync(password, 10);
