import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CompanyForm = {
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
};

type CompanyState = {
  form: CompanyForm;
  setField: (field: keyof CompanyForm, value: string | File | null) => void;
  setForm: (form: CompanyForm) => void;
  resetForm: () => void;
};

const emptyForm: CompanyForm = {
  name: "",
  email: "",
  documentCode: "",
  regime: "",
  nif: "",
  website: "",
  phone: "",
  tradeRegister: "",
  province: "",
  municipality: "",
  street: "",
  neighborhood: "",
  building: "",
  logo: null,
};

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      form: emptyForm,
      setField: (field, value) =>
        set((state) => ({ form: { ...state.form, [field]: value } })),
      setForm: (form) => set({ form }),
      resetForm: () => set({ form: emptyForm }),
    }),
    {
      name: "company-form",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
