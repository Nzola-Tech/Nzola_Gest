// domain/sale.rs
use crate::domain::{DomainError, SaleItem};
use bigdecimal::BigDecimal;

#[derive(Debug)]
pub struct Sale {
    pub id: Option<u64>,
    pub user_id: Option<u64>,
    pub subtotal: BigDecimal,
    pub discount_total: BigDecimal,
    pub total: BigDecimal,
    pub payment_method: String,
}

impl Sale {
    pub fn new(payment_method: String) -> Result<Self, DomainError> {
        if payment_method.trim().is_empty() {
            return Err(DomainError::Invalid("Método de pagamento é obrigatório"));
        }

        Ok(Self {
            id: None,
            user_id: None,
            subtotal: BigDecimal::from(0),
            discount_total: BigDecimal::from(0),
            total: BigDecimal::from(0),
            payment_method,
        })
    }

    pub fn add_item(&mut self, item: SaleItem) {
        self.subtotal += item.subtotal;
        self.discount_total += item.discount_amount;
        self.total += item.total;
    }
}
