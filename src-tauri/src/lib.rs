mod app_state;
mod commands;
mod db;
mod migrations;

use tauri::Manager;
use app_state::AppState;
use db::mysql;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
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
                // 🔐 depois vamos mover isso para env
                let database_url = "mysql://root:admin@localhost/nzola_gest";

                let pool = mysql::connect(database_url).await;

                handle.manage(AppState { db: pool });
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::health::health_check
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
