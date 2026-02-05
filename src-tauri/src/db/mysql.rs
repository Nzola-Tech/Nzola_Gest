use sqlx::{mysql::MySqlPoolOptions, MySqlPool};

pub async fn connect(database_url: &str) -> MySqlPool {
    MySqlPoolOptions::new()
        .max_connections(5)
        .connect(database_url)
        .await
        .expect("Falha ao conectar ao MySQL")
}
