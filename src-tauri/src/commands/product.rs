//File src-tauri/src/commands/product.rs
use tauri::State;
use crate::application::product_service::ProductService;
use crate::infrastructure::mysql_product_repository::MySqlProductRepository;
use crate::application::dto::create_product_dto::CreateProductDTO;
use crate::application::dto::product_response_dto::ProductResponseDTO;
use crate::application::dto::update_product_dto::UpdateProductDTO;

#[tauri::command]
pub async fn create_product(
    service: State<'_, ProductService<MySqlProductRepository>>,
    input: CreateProductDTO,
) -> Result<u64, String> {

    service.create_product(input).await
}

#[tauri::command]
pub async fn list_products(
    service: State<'_, ProductService<MySqlProductRepository>>,
) -> Result<Vec<ProductResponseDTO>, String> {
    service.list_products().await
}

#[tauri::command]
pub async fn get_product(
    service: State<'_, ProductService<MySqlProductRepository>>,
    id: u64,
) -> Result<Option<ProductResponseDTO>, String> {
    service.get_product(id).await.map(|opt| opt.map(ProductResponseDTO::from))
}

#[tauri::command]
pub async fn update_product(
    service: State<'_, ProductService<MySqlProductRepository>>,
    input: UpdateProductDTO,
) -> Result<(), String> {
    service.update_product(input).await
}

#[tauri::command]
pub async fn delete_product(
    service: State<'_, ProductService<MySqlProductRepository>>,
    id: u64,
) -> Result<(), String> {
    service.delete_product(id).await
}
