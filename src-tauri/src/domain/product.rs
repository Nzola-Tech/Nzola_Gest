use crate::domain::DomainError;
use bigdecimal::BigDecimal;
use chrono::NaiveDate;

#[derive(Debug, Clone, PartialEq)]
#[derive(serde::Serialize)]
pub enum ProductType {
    Produto,
    Servico,
}

#[derive(Debug, Clone)]
pub struct Product {
    id: Option<u64>,
    name: String,
    product_type: ProductType,
    description: Option<String>,
    expiration_date: Option<NaiveDate>,
    stock_quantity: i32,
    sale_price: BigDecimal,
    category: Option<String>,
}

impl Product {
    pub fn create(
        name: String,
        sale_price: BigDecimal,
        stock_quantity: i32,
        product_type: ProductType,
    ) -> Result<Self, DomainError> {
        if name.trim().is_empty() {
            return Err(DomainError::Invalid("Nome do produto é obrigatório"));
        }

        if sale_price <= BigDecimal::from(0) {
            return Err(DomainError::Invalid("Preço de venda inválido"));
        }

        if stock_quantity < 0 {
            return Err(DomainError::Invalid("Stock não pode ser negativo"));
        }

        Ok(Self {
            id: None,
            name,
            product_type,
            description: None,
            expiration_date: None,
            stock_quantity,
            sale_price,
            category: None,
        })
    }

    pub fn increase_stock(&mut self, quantity: i32) -> Result<(), DomainError> {
        if quantity <= 0 {
            return Err(DomainError::Invalid("Quantidade inválida"));
        }

        self.stock_quantity += quantity;
        Ok(())
    }

    pub fn decrease_stock(&mut self, quantity: i32) -> Result<(), DomainError> {
        if quantity <= 0 {
            return Err(DomainError::Invalid("Quantidade inválida"));
        }

        if quantity > self.stock_quantity {
            return Err(DomainError::Invalid("Stock insuficiente"));
        }

        self.stock_quantity -= quantity;
        Ok(())
    }

    pub fn change_price(&mut self, new_price: BigDecimal) -> Result<(), DomainError> {
        if new_price <= BigDecimal::from(0) {
            return Err(DomainError::Invalid("Preço inválido"));
        }

        self.sale_price = new_price;
        Ok(())
    }

    pub fn set_id(&mut self, id: u64) {
        self.id = Some(id);
    }

    pub fn get_id(&self) -> Option<u64> {
        self.id
    }

    pub fn get_name(&self) -> &str {
        &self.name
    }

    pub fn get_stock(&self) -> i32 {
        self.stock_quantity
    }
    pub fn get_price(&self) -> &BigDecimal {
        &self.sale_price
    }

    pub fn get_product_type(&self) -> &ProductType {
        &self.product_type
    }

    pub fn change_name(&mut self, new_name: String) -> Result<(), DomainError> {
        if new_name.trim().is_empty() {
            return Err(DomainError::Invalid("Nome inválido"));
        }

        self.name = new_name;
        Ok(())
    }
}
