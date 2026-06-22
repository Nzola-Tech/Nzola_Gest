import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Store } from "@tauri-apps/plugin-store";
import bcrypt from "bcryptjs";

import { useDbStore } from "./db-store";

import { User } from "@/types/signup/index";

interface AuthState {
  user: Pick<User, "id" | "username" | "role" | "status" | "name" | "surname" | "email"> | null;
  loading: boolean;
  login: (userData: User) => Promise<void | boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

let storeInstance: Store | null = null;
const getStore = async () => {
  if (!storeInstance) {
    storeInstance = await Store.load(".auth.dat");
  }

  return storeInstance;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,

      login: async (userData) => {
        const db = useDbStore.getState().db;

        if (!db) throw new Error("Banco de dados não inicializado");

        // Busca apenas o hash da senha para o username fornecido
        const pwdb = await db.select<User[]>(
          "SELECT password FROM users WHERE username = ?",
          [userData.username],
        );

        if (pwdb.length === 0) {
          throw new Error("Usuário não encontrado");
        }

        const hashArmazenado = pwdb[0].password;

        // Compara senha digitada com hash do banco
        const match = await bcrypt.compare(userData.password, hashArmazenado);

        if (!match) {
          console.log("Senha incorreta");
          throw new Error("Usuário ou senha inválidos");
        }

        // Agora busca todos os dados do usuário
        const user = await db.select<User[]>(
          "SELECT * FROM users WHERE username = ?",
          [userData.username],
        );

        if (user.length === 1) {
          const store = await getStore();

          await store.set("user", {
            id: user[0].id,
            username: user[0].username,
            name: user[0].name,
            surname: user[0].surname,
            role: user[0].role,
            status: "active",
            email: user[0].email,
          });
          await store.save();

          set({
            user: {
              id: user[0].id,
              username: user[0].username,
              name: user[0].name,
              surname: user[0].surname,
              role: user[0].role,
              status: "active",
              email: user[0].email,
            },
            loading: false,
          });

          return true;
        } else {
          throw new Error("Usuário ou senha inválidos");
        }
      },

      logout: async () => {
        const store = await getStore();

        await store.delete("user");
        await store.save();
        set({ user: null, loading: false });
      },

      checkAuth: async () => {
        const store = await getStore();
        const savedUser = await store.get<User>("user");

        set({ user: savedUser || null, loading: false });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
