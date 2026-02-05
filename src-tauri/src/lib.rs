mod app_state;
mod commands;
mod db;
mod migrations;

use app_state::AppState;
use db::mysql;
use std::env;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    dotenvy::dotenv().ok();

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            let handle = app.handle().clone();

            tauri::async_runtime::block_on(async move {
                let database_url = env::var("DATABASE_URL").expect("DATABASE_URL não definida");

                let pool = mysql::connect(&database_url)
                    .await
                    .expect("Falha ao conectar no MySQL");

                handle.manage(AppState { db: pool });
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![commands::health::health_check])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
