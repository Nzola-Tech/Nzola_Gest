import Database from "@tauri-apps/plugin-sql";

export interface DailyProductSales {
  product_id: number;
  product_name: string;
  total_quantity: number;
  sale_date: string;
}

export async function getTop10ProductsByDay(
  db: Database,
): Promise<DailyProductSales[]> {
  const hoje = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  const result = await db.select<DailyProductSales[]>(
    `SELECT 
        p.id as product_id,
        p.name as product_name,
        DATE(s.created_at) as sale_date,
        SUM(si.quantity) as total_quantity
        FROM sale_items si
        JOIN products p ON p.id = si.product_id
        JOIN sales s ON s.id = si.sale_id
        WHERE DATE(s.created_at) = DATE(?)
        GROUP BY p.id, DATE(s.created_at)
        ORDER BY total_quantity DESC
        LIMIT 10
    `,
    [hoje],
  );

  return result;
}
