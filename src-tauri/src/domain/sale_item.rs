// domain/sale_item.rs
use crate::domain::DomainError;

#[derive(Debug, Clone)]
pub struct SaleItem {
    pub product_id: u64,
    pub quantity: i32,
    pub unit_price: f64,
    pub discount_type: Option<String>,
    pub discount_value: f64,
    pub discount_amount: f64,
    pub subtotal: f64,
    pub total: f64,
}

impl SaleItem {
    pub fn new(
        product_id: u64,
        quantity: i32,
        unit_price: f64,
        discount_value: f64,
    ) -> Result<Self, DomainError> {
        if quantity <= 0 {
            return Err(DomainError::Invalid("Quantidade inválida"));
        }

        if unit_price <= 0.0 {
            return Err(DomainError::Invalid("Preço unitário inválido"));
        }

        let subtotal = quantity as f64 * unit_price;
        let discount_amount = discount_value.min(subtotal);
        let total = subtotal - discount_amount;

        Ok(Self {
            product_id,
            quantity,
            unit_price,
            discount_type: None,
            discount_value,
            discount_amount,
            subtotal,
            total,
        })
    }
}
