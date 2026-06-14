// domain/sale_item.rs
use crate::domain::DomainError;
use bigdecimal::BigDecimal;

#[derive(Debug, Clone)]
pub struct SaleItem {
    pub product_id: u64,
    pub quantity: i32,
    pub unit_price: BigDecimal,
    pub discount_type: Option<String>,
    pub discount_value: BigDecimal,
    pub discount_amount: BigDecimal,
    pub subtotal: BigDecimal,
    pub total: BigDecimal,
}

impl SaleItem {
    pub fn new(
        product_id: u64,
        quantity: i32,
        unit_price: BigDecimal,
        discount_value: BigDecimal,
    ) -> Result<Self, DomainError> {
        if quantity <= 0 {
            return Err(DomainError::Invalid("Quantidade inválida"));
        }

        if unit_price <= BigDecimal::from(0) {
            return Err(DomainError::Invalid("Preço unitário inválido"));
        }

        let subtotal = BigDecimal::from(quantity) * unit_price.clone();
        let discount_amount = discount_value.clone().min(subtotal.clone());
        let total = subtotal.clone() - discount_amount.clone();

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
