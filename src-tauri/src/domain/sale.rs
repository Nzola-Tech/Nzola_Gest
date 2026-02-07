// domain/sale.rs
use crate::domain::{DomainError, SaleItem};

#[derive(Debug)]
pub struct Sale {
    pub id: Option<u64>,
    pub items: Vec<SaleItem>,
    pub subtotal: f64,
    pub discount_total: f64,
    pub total: f64,
    pub payment_method: String,
}

impl Sale {
    pub fn new(payment_method: String) -> Result<Self, DomainError> {
        if payment_method.trim().is_empty() {
            return Err(DomainError::Invalid("Método de pagamento é obrigatório"));
        }

        Ok(Self {
            id: None,
            items: vec![],
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
        self.items.push(item);
    }
}
