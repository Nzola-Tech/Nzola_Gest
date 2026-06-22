import { create } from "zustand";
import Database from "@tauri-apps/plugin-sql"; // plugin SQL

export type CompanyInfo = {
    id?: number;
    name: string;
    email: string;
    documentCode: string;
    regime: string;
    nif: string;
    website?: string;
    phone: string;
    tradeRegister: string;
    province: string;
    municipality: string;
    street: string;
    neighborhood: string;
    building: string;
    logo?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

type CompanyInfoState = {
    company: CompanyInfo | null;
    loading: boolean;
    error: string | null;
    fetchCompany: () => Promise<void>;
    saveCompany: (data: CompanyInfo) => Promise<void>;
    updateField: (field: keyof CompanyInfo, value: string | null) => Promise<void>;
    clearCompany: () => void;
};

// Caminho do teu banco (conforme configurado no tauri.conf.json)
const DB_PATH = "sqlite:ngf.db";

export const useCompanyInfoStore = create<CompanyInfoState>((set, get) => ({
    company: null,
    loading: false,
    error: null,

    // 🔹 Busca a empresa do banco
    fetchCompany: async () => {
        try {
            set({ loading: true, error: null });
            const db = await Database.load(DB_PATH);
            const result = await db.select<CompanyInfo[]>(
                "SELECT * FROM company LIMIT 1;"
            );
            if (result.length > 0) {
                set({ company: result[0] });
            } else {
                set({ company: null });
            }
        } catch (err: any) {
            console.error("Erro ao buscar empresa:", err);
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },

    // 🔹 Salva ou atualiza os dados da empresa no banco
    saveCompany: async (data) => {
        try {
            const db = await Database.load(DB_PATH);
            if (data.id) {
                await db.execute(
                    `UPDATE company SET 
            name = ?, email = ?, documentCode = ?, regime = ?, nif = ?, website = ?, 
            phone = ?, tradeRegister = ?, province = ?, municipality = ?, street = ?, 
            neighborhood = ?, building = ?, logo = ?, updatedAt = CURRENT_TIMESTAMP
          WHERE id = ?`,
                    [
                        data.name, data.email, data.documentCode, data.regime, data.nif,
                        data.website, data.phone, data.tradeRegister, data.province,
                        data.municipality, data.street, data.neighborhood, data.building,
                        data.logo, data.id,
                    ]
                );
            } else {
                await db.execute(
                    `INSERT INTO company 
            (name, email, documentCode, regime, nif, website, phone, tradeRegister, province, municipality, street, neighborhood, building, logo, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
                    [
                        data.name, data.email, data.documentCode, data.regime, data.nif,
                        data.website, data.phone, data.tradeRegister, data.province,
                        data.municipality, data.street, data.neighborhood, data.building,
                        data.logo,
                    ]
                );
            }
            await get().fetchCompany(); // recarrega os dados atualizados
        } catch (err: any) {
            console.error("Erro ao salvar empresa:", err);
            set({ error: err.message });
        }
    },

    // 🔹 Atualiza um único campo
    updateField: async (field, value) => {
        const current = get().company;
        if (!current || !current.id) return;
        try {
            const db = await Database.load(DB_PATH);
            await db.execute(
                `UPDATE company SET ${field} = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
                [value, current.id]
            );
            set({ company: { ...current, [field]: value } });
        } catch (err: any) {
            console.error("Erro ao atualizar campo:", err);
            set({ error: err.message });
        }
    },

    clearCompany: () => set({ company: null }),
}));
