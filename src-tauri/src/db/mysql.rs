// db/mysql.rs
use sqlx::{mysql::MySqlPoolOptions, MySqlPool};

pub async fn connect(database_url: &str) -> Result<MySqlPool, sqlx::Error> {
    MySqlPoolOptions::new()
        .max_connections(5)
        .connect(database_url)
        .await
}