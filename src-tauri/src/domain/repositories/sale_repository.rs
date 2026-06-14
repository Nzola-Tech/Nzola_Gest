// src-tauri/src/domain/repositories/sale_repository.rs
use crate::domain::{Sale, SaleItem};

#[async_trait::async_trait]
pub trait SaleRepository: Send + Sync {
    async fn create(
        &self,
        sale: &mut Sale,
        items: Vec<SaleItem>,
    ) -> Result<(), String>;

    async fn cancel(&self, sale_id: u64) -> Result<(), String>;
}