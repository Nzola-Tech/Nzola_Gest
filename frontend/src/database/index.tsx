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
  createdAt: string,
  payment: string,
  subtotal?: number,
  discountTotal?: number,
) {
  const result = await db.execute(
    "INSERT INTO sales (total, payment_method, created_at,subtotal, discount_total) VALUES ($1, $2, $3, $4, $5)",
    [total, payment, createdAt, subtotal, discountTotal],
  );

  const { lastInsertId } = result;

  if (!lastInsertId) return 0;

  return lastInsertId;
}

export async function insertSaleItemsAndUpdateStock(
  db: Database,
  saleId: number,
  cart: CartItem[],
  createdAt: string,
) {
  for (const item of cart) {
    const unitPrice = item.unit_price ?? item.sale_price;
    const quantity = item.quantity;

    const subtotal = item.subtotal ?? unitPrice * quantity;

    let discountAmount = item.discount_amount;

    if (discountAmount == null) {
      if (item.discount_type === "FIXED") {
        discountAmount = Math.min(
          item.discount_value ?? 0,
          subtotal,
        );
      } else if (item.discount_type === "PERCENTAGE") {
        discountAmount =
          subtotal * ((item.discount_value ?? 0) / 100);
      } else {
        discountAmount = 0;
      }
    }

    const total = item.total ?? Math.max(0, subtotal - discountAmount);

    await db.execute(
      `
      INSERT INTO sale_items (
        sale_id,
        product_id,
        quantity,
        price,
        unit_price,
        subtotal,
        discount_type,
        discount_value,
        discount_amount,
        total,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        saleId,
        item.id,
        quantity,
        unitPrice, 
        unitPrice,
        subtotal,
        item.discount_type ?? null,
        item.discount_value ?? 0,
        discountAmount,
        total,
        createdAt,
      ],
    );

    await db.execute(
      `
      UPDATE products
      SET stock_quantity = stock_quantity - ?
      WHERE id = ?
      `,
      [quantity, item.id],
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

