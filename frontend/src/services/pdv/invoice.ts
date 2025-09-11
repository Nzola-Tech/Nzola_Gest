import Database from "@tauri-apps/plugin-sql";

import { Sale, SaleItem } from "@/types/pdv";

export async function invoicesOfTheDay(db: Database | null): Promise<Sale[]> {
  const hoje = new Date().toISOString().split("T")[0];
  const result = await db?.select(
    `SELECT id, total, payment_method, created_at
     FROM sales
     WHERE DATE(created_at) = DATE(?) 
     ORDER BY id DESC`,
    [hoje],
  );

  return result as Sale[];
}

export async function invoiceItems(
  db: Database | null,
  saleId: number,
): Promise<SaleItem[]> {
  if (!db) return [];
  const result = await db.select(
    `SELECT si.id,
            si.sale_id,
            si.product_id,
            si.quantity,
            si.price,
            si.created_at,
            p.name AS product_name
     FROM sale_items si
     JOIN products p ON p.id = si.product_id
     WHERE si.sale_id = ?`,
    [saleId],
  );

  return result as SaleItem[];
}
