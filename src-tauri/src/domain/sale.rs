// domain/sale.rs
use crate::domain::{DomainError, SaleItem};

#[derive(Debug)]
pub struct Sale {
    id: Option<u64>,
    user_id: Option<u64>,
    subtotal: f64,
    discount_total: f64,
    total: f64,
    payment_method: String,
}

impl Sale {
    pub fn new(payment_method: String) -> Result<Self, DomainError> {
        if payment_method.trim().is_empty() {
            return Err(DomainError::Invalid("Método de pagamento é obrigatório"));
        }

        Ok(Self {
            id: None,
            user_id: None,
            subtotal: 0.0,
            discount_total: 0.0,
            total: 0.0,
            payment_method,
        })
    }

    pub fn add_item(&mut self, item: SaleItem) {
        self.subtotal += item.subtotal;
        self.discount_total += item.discount_amount;
        self.total += item.total;
    }
}
