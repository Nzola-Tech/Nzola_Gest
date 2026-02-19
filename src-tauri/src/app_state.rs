//File: src-tauri/src/app_state.rs
use sqlx::MySqlPool;

pub struct AppState {
    pub db: MySqlPool,
}
