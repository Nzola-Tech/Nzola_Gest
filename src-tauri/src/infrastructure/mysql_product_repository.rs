//File: src-tauri/src/infrastructure/mysql_product_repository.rs

use crate::domain::product::Product;
use crate::domain::repositories::product_repository::ProductRepository;
use sqlx::MySqlPool;

pub struct MySqlProductRepository {
    pool: MySqlPool,
}

impl MySqlProductRepository {
    pub fn new(pool: MySqlPool) -> Self {
        Self { pool }
    }
}
#[async_trait::async_trait]
impl ProductRepository for MySqlProductRepository {
    async fn save(&self, product: &mut Product) -> Result<u64, String> {
        let result = sqlx::query(
            r#"
            INSERT INTO products (name, product_type, stock_quantity, sale_price)
            VALUES (?, ?, ?, ?)
            "#,
        )
        .bind(product.get_name())
        .bind("Produto")
        .bind(product.get_stock())
        .bind(product.get_price())
        .execute(&self.pool)
        .await
        .map_err(|e| e.to_string())?;

        let id = result.last_insert_id();

        product.set_id(id);

        Ok(id)
    }

    async fn find_all(&self) -> Result<Vec<Product>, String> {
        let rows = sqlx::query!(
            r#"
            SELECT id, name, stock_quantity, sale_price
            FROM products
            "#
        )
        .fetch_all(&self.pool)
        .await
        .map_err(|e| e.to_string())?;

        let products = rows
            .into_iter()
            .map(|row| {
                let mut product = Product::create(
                    row.name,
                    row.sale_price.unwrap_or_default(),
                    row.stock_quantity.unwrap_or_default(),
                    crate::domain::product::ProductType::Produto,
                )
                .unwrap();

                product.set_id(row.id as u64);
                product
            })
            .collect();

        Ok(products)
    }

    async fn find_by_id(&self, id: u64) -> Result<Option<Product>, String> {
        let row = sqlx::query!(
            r#"
            SELECT id, name, stock_quantity, sale_price
            FROM products
            WHERE id = ?
            "#,
            id
        )
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| e.to_string())?;

        if let Some(row) = row {
            let mut product = Product::create(
                row.name,
                row.sale_price.unwrap_or_default(),
                row.stock_quantity.unwrap_or_default(),
                crate::domain::product::ProductType::Produto,
            )
            .unwrap();

            product.set_id(row.id as u64);
            Ok(Some(product))
        } else {
            Ok(None)
        }
    }

    async fn update(&self, product: &Product) -> Result<(), String> {
        sqlx::query(
            r#"
        UPDATE products
        SET name = ?, sale_price = ?
        WHERE id = ?
        "#,
        )
        .bind(product.get_name())
        .bind(product.get_price())
        .bind(product.get_id().unwrap())
        .execute(&self.pool)
        .await
        .map_err(|e| e.to_string())?;

        Ok(())
    }

    async fn delete(&self, id: u64) -> Result<(), String> {
        sqlx::query("DELETE FROM products WHERE id = ?")
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(|e| e.to_string())?;

        Ok(())
    }
}
