use bigdecimal::BigDecimal;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct UpdateProductDTO {
    pub id: u64,
    pub name: Option<String>,
    pub price: Option<BigDecimal>,
}
