use bigdecimal::BigDecimal;
use serde::Serialize;
use crate::domain::product::{Product,ProductType};

#[derive(Serialize)]
pub struct ProductResponseDTO {
    pub id: u64,
    pub name: String,
    pub stock: i32,
    pub price: BigDecimal,
    pub product_type: ProductType,
}

impl From<Product> for ProductResponseDTO {
    fn from(product: Product) -> Self {
        Self {
            id: product.get_id().unwrap_or(0),
            name: product.get_name().to_string(),
            stock: product.get_stock(),
            price: product.get_price().clone(),
            product_type: product.get_product_type().clone(),
        }
    }
}
