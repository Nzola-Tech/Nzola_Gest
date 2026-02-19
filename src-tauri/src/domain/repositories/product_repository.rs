//File: src-tauri/src/domain/repositories/product_repository.rs

use crate::{application::dto::product_response_dto::ProductResponseDTO, domain::product::Product};

#[async_trait::async_trait]
pub trait ProductRepository: Send + Sync {
    async fn save(&self, product: &mut Product) -> Result<u64, String>;
    async fn find_by_id(&self, id: u64) -> Result<Option<Product>, String>;
    async fn find_all(&self) -> Result<Vec<ProductResponseDTO>, String>;
    async fn update(&self, product: &Product) -> Result<(), String>;
    async fn delete(&self, id: u64) -> Result<(), String>;
}
