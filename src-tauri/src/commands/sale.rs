// src/commands/sale.rs
use tauri::State;
use crate::application::sale_service::SaleService;
use crate::infrastructure::mysql_sale_repository::MySqlSaleRepository;
use crate::application::dto::create_sale_dto::CreateSaleDTO;

#[tauri::command]
async fn create_sale(
    state: State<'_, SaleService>,
    dto: CreateSaleDTO,
) -> Result<(), String> {
    state.create_sale(dto).await
}