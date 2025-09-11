import Database from "@tauri-apps/plugin-sql";

export interface MonthlySales {
  mes: string;
  total: number;
}

export interface Expense {
  tipo: string;
  valor: number;
}

// Vendas mensais (últimos 6 meses)
export async function getMonthlySales(db: Database): Promise<MonthlySales[]> {
  const result = await db.select(
    `SELECT strftime('%m', created_at) as mes, SUM(total) as total
     FROM sales
     WHERE created_at >= date('now', '-6 months')
     GROUP BY strftime('%m', created_at)
     ORDER BY mes ASC`
  );
  return result as MonthlySales[];
}

// Despesas (se tiver uma tabela despesas, senão deixamos mock)
export async function getExpenses(db: Database): Promise<Expense[]> {
  const result = await db.select(
    `SELECT category as tipo, SUM(amount) as valor
     FROM expenses
     WHERE created_at >= date('now','start of month')
     GROUP BY category`
  );
  return result as Expense[];
}

// Top 10 produtos mais vendidos do mês
export async function getTopProductsThisMonth(db: Database) {
  const result = await db.select(
    `SELECT p.name as product_name, SUM(si.quantity) as total_quantity
     FROM sale_items si
     JOIN products p ON p.id = si.product_id
     JOIN sales s ON s.id = si.sale_id
     WHERE strftime('%m', s.created_at) = strftime('%m','now')
     GROUP BY p.id
     ORDER BY total_quantity DESC
     LIMIT 10`
  );
  return result as { product_name: string; total_quantity: number }[];
}
