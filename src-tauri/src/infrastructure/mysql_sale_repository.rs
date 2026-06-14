// src/infrastructure/mysql_sale_repository.rs
use crate::domain::repositories::sale_repository::SaleRepository;
use crate::domain::{Sale, SaleItem};
use sqlx::{MySql, MySqlPool, Transaction};

pub struct MySqlSaleRepository {
    pool: MySqlPool,
}

#[async_trait::async_trait]
impl SaleRepository for MySqlSaleRepository {
    async fn create(&self, sale: &mut Sale, items: Vec<SaleItem>) -> Result<(), String> {
        let mut tx: Transaction<MySql> = self.pool.begin().await.map_err(|e| e.to_string())?;

        // 1️⃣ Inserir Sale
        let result = sqlx::query!(
            r#"
            INSERT INTO sales
            (user_id, subtotal, discount_total, total, payment_method)
            VALUES (?, ?, ?, ?, ?)
            "#,
            sale.user_id,
            sale.subtotal,
            sale.discount_total,
            sale.total,
            sale.payment_method
        )
        .execute(&mut *tx)
        .await
        .map_err(|e| e.to_string())?;

        let sale_id = result.last_insert_id();
        sale.id = Some(sale_id);

        // 2️⃣ Inserir itens + atualizar stock
        for item in items {
            // Inserir item
            sqlx::query!(
                r#"
                INSERT INTO sale_items
                (
                    sale_id, product_id, quantity,
                    unit_price, discount_type,
                    discount_value, discount_amount,
                    subtotal, total
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                "#,
                sale_id,
                item.product_id,
                item.quantity,
                item.unit_price,
                item.discount_type,
                item.discount_value,
                item.discount_amount,
                item.subtotal,
                item.total
            )
            .execute(&mut *tx)
            .await
            .map_err(|e| e.to_string())?;

            // 🔥 Atualizar stock
            let affected = sqlx::query!(
                r#"
                UPDATE products
                SET stock_quantity = stock_quantity - ?
                WHERE id = ? AND stock_quantity >= ?
                "#,
                item.quantity,
                item.product_id,
                item.quantity
            )
            .execute(&mut *tx)
            .await
            .map_err(|e| e.to_string())?
            .rows_affected();

            if affected == 0 {
                return Err("Stock insuficiente".into());
            }
        }

        tx.commit().await.map_err(|e| e.to_string())?;

        Ok(())
    }

    async fn cancel(&self, sale_id: u64) -> Result<(), String> {
        let mut tx: Transaction<MySql> = self.pool.begin().await.map_err(|e| e.to_string())?;

        // Get sale items to restore stock
        let items = sqlx::query_as::<_, (u64, i32)>(
            r#"
            SELECT product_id, quantity FROM sale_items WHERE sale_id = ?
            "#
        )
        .bind(sale_id)
        .fetch_all(&mut *tx)
        .await
        .map_err(|e| e.to_string())?;

        // Restore stock for each item
        for (product_id, quantity) in items {
            sqlx::query!(
                r#"
                UPDATE products
                SET stock_quantity = stock_quantity + ?
                WHERE id = ?
                "#,
                quantity,
                product_id
            )
            .execute(&mut *tx)
            .await
            .map_err(|e| e.to_string())?;
        }

        // Delete sale items
        sqlx::query!("DELETE FROM sale_items WHERE sale_id = ?", sale_id)
            .execute(&mut *tx)
            .await
            .map_err(|e| e.to_string())?;

        // Delete sale
        sqlx::query!("DELETE FROM sales WHERE id = ?", sale_id)
            .execute(&mut *tx)
            .await
            .map_err(|e| e.to_string())?;

        tx.commit().await.map_err(|e| e.to_string())?;

        Ok(())
    }
}
