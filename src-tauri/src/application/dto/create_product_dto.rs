// File src-tauri/application/dto/create_product_dto.rs

use bigdecimal::BigDecimal;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct CreateProductDTO {
    pub name: String,
    pub price: BigDecimal,
    pub stock: i32,
}