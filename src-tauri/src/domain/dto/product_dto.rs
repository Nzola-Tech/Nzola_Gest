// domain/dto/product_dto.rs
use chrono::{NaiveDate, NaiveDateTime};

#[derive(Debug, Clone)]
pub struct ProductDTO {
    pub id: u64,
    pub name: String,
    pub description: Option<String>,
    pub expiration_date: Option<NaiveDate>,
    pub stock_quantity: i32,
    pub sale_price: f64,
    pub category: Option<String>,
    pub deleted: bool,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}
