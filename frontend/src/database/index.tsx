import Database from "@tauri-apps/plugin-sql";

import { Product } from "../types/products";

import { CartItem } from "@/types/pdv";
import { Company } from "@/types/database";

export async function fetchProducts(db: Database | null): Promise<Product[]> {
  const result = await db?.select("SELECT * FROM products");

  return result as Product[];
}

export async function insertSale(
  db: Database,
  total: number,
  payment: string,
  createdAt: string,
) {
  const result = await db.execute(
    "INSERT INTO sales (total, payment_method, created_at) VALUES ($1, $2, $3)",
    [total, payment, createdAt],
  );

  const { lastInsertId } = result;

  if (!lastInsertId) return 0;

  return lastInsertId;
}

export async function insertSaleItemsAndUpdateStock(
  db: any,
  saleId: number,
  cart: CartItem[],
  createdAt: string,
) {
  for (const item of cart) {
    await db.execute(
      "INSERT INTO sale_items (sale_id, product_id, quantity, price, created_at) VALUES ($1, $2, $3, $4, $5)",
      [saleId, item.id, item.quantity, item.sale_price, createdAt],
    );
    await db.execute(
      "UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2",
      [item.quantity, item.id],
    );
  }
}

export async function productsSoldToday(db: Database | null) {
  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  const result = await db?.select<{ soldToday: number }[]>(
    `SELECT COALESCE(SUM(si.quantity), 0) as soldToday
     FROM sale_items si
     JOIN sales s ON s.id = si.sale_id
     WHERE DATE(si.created_at) = ?`,
    [today],
  );

  if (!result || result.length === 0) return 0;

  return result[0].soldToday;
}

export async function totalSalesToday(db: Database | null) {
  const today = new Date().toISOString().split("T")[0];

  const result = await db?.select<{ totalToday: number }[]>(
    `SELECT COALESCE(SUM(total), 0) as totalToday
     FROM sales
     WHERE DATE(created_at) = ?`,
    [today],
  );

  if (!result || result.length === 0) return 0;

  return result[0].totalToday;
}

export const handleDelete = async (
  id: number,
  db: Database | null,
  onProductChange?: () => void,
) => {
  if (!db) return;
  const sales = (await db.select(
    "SELECT 1 FROM sale_items WHERE product_id = $1 LIMIT 1",
    [id],
  )) as Array<{ 1: number }>;

  if (sales.length > 0) {
    alert("Não é possível excluir produtos que já foram vendidos.");

    return;
  }
  await db.execute("DELETE FROM products WHERE id = $1", [id]);
  if (onProductChange) onProductChange();
};

export const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>,
  db: Database | null,
  cart: CartItem[],
  total: number,
  totalPayment: number,
  payment: string,
  setPaymentError: (value: boolean) => void,
  setTotalPayment: (value: number) => void,
  setCart: (cart: CartItem[]) => void,
  setSelectedKeys: (keys: Set<[unknown]>) => void,
  refreshProducts?: () => void,
) => {
  e.preventDefault();
  if (!db || cart.length === 0) return;
  if (totalPayment === 0 || totalPayment < total) {
    setPaymentError(true);

    return;
  }
  const now = new Date().toISOString();
  const saleId = await insertSale(db, total, payment, now);

  await insertSaleItemsAndUpdateStock(db, saleId, cart, now);

  setTotalPayment(0);
  setCart([]);
  setSelectedKeys(new Set([]));
  refreshProducts && refreshProducts();
};

export const existingCompany = async (db: Database | null) => {
  if (!db) return false;
  const company = await db?.select<Company[]>("SELECT * FROM company");

  if (company.length > 0) return true;

  return false;
};

export const insertCompany = async (db: Database | null, company: Company) => {
  if (!db) return false;

  try {
    const result = await db.execute(
      "INSERT INTO company (name, nif, email, phone) VALUES (?, ?, ?, ?)",
      [company.name, company.nif, company.email, company.phone]
    );
    
    return result.rowsAffected > 0;
  } catch (err) {
    return false;
  }
};

