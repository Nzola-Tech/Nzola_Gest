//File src-tauri/src/application/product_service.rs

use crate::application::dto::create_product_dto::CreateProductDTO;
use crate::application::dto::product_response_dto::ProductResponseDTO;
use crate::application::dto::update_product_dto::UpdateProductDTO;
use crate::domain::repositories::product_repository::ProductRepository;
use crate::domain::{product::Product, product::ProductType};

pub struct ProductService<R: ProductRepository> {
    repository: R,
}

impl<R: ProductRepository> ProductService<R> {
    pub fn new(repository: R) -> Self {
        Self { repository }
    }

    pub async fn create_product(&self, dto: CreateProductDTO) -> Result<u64, String> {
        //Domain cria a entidade a partir do DTO
        let mut product = Product::create(
            dto.name,
            dto.price,
            dto.stock,
            ProductType::Produto, // Tipo fixo para este exemplo
        )
        .map_err(|e| format!("{:?}", e))?;

        let id = self.repository.save(&mut product).await?;

        Ok(id)
    }

    pub async fn list_products(&self) -> Result<Vec<ProductResponseDTO>, String> {
        self.repository.find_all().await
    }

    pub async fn get_product(&self, id: u64) -> Result<Option<Product>, String> {
        self.repository.find_by_id(id).await
    }

    pub async fn update_product(&self, dto: UpdateProductDTO) -> Result<(), String> {
        // 1️⃣ Buscar produto
        let mut product = self
            .repository
            .find_by_id(dto.id)
            .await?
            .ok_or("Produto não encontrado")?;

        // 2️⃣ Aplicar alterações se existirem
        if let Some(name) = dto.name {
            product.change_name(name).map_err(|e| format!("{:?}", e))?;
        }

        if let Some(price) = dto.price {
            product
                .change_price(price)
                .map_err(|e| format!("{:?}", e))?;
        }

        // 3️⃣ Persistir
        self.repository.update(&product).await
    }

    pub async fn delete_product(&self, id: u64) -> Result<(), String> {
        self.repository.delete(id).await
    }
}
