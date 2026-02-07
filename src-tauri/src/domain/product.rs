// domain/product.rs
use chrono::NaiveDate;
use crate::domain::DomainError;

#[derive(Debug, Clone)]
pub struct Product {
    pub id: Option<u64>,
    pub name: String,
    pub description: Option<String>,
    pub expiration_date: Option<NaiveDate>,
    pub stock_quantity: i32,
    pub sale_price: f64,
    pub category: Option<String>,
    pub deleted: bool,
}

impl Product {
    pub fn new(
        name: String,
        sale_price: f64,
        stock_quantity: i32,
    ) -> Result<Self, DomainError> {
        if name.trim().is_empty() {
            return Err(DomainError::Invalid("Nome do produto é obrigatório"));
        }

        if sale_price <= 0.0 {
            return Err(DomainError::Invalid("Preço de venda inválido"));
        }

        if stock_quantity < 0 {
            return Err(DomainError::Invalid("Stock não pode ser negativo"));
        }

        Ok(Self {
            id: None,
            name,
            description: None,
            expiration_date: None,
            stock_quantity,
            sale_price,
            category: None,
            deleted: false,
        })
    }
}
