// File src-tauri/src/lib.rs

mod app_state;
mod application;
mod commands;
mod db;
mod domain;
mod infrastructure;
mod migrations;

use app_state::AppState;
use db::mysql;
use std::env;
use tauri::Manager;

use crate::application::product_service::ProductService;
use crate::infrastructure::mysql_product_repository::MySqlProductRepository;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    dotenvy::dotenv().ok();
    
    #[allow(non_snake_case)]
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL não definida");

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

                let pool = mysql::connect(&database_url)
                    .await
                    .expect("Falha ao conectar no MySQL");

                let repository = MySqlProductRepository::new(pool.clone());
                let service = ProductService::new(repository);

                handle.manage(service);
                handle.manage(AppState { db: pool });
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::health::health_check,
            commands::product::create_product,
            commands::product::list_products,
            commands::product::get_product,
            commands::product::delete_product,
            commands::product::update_product
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
