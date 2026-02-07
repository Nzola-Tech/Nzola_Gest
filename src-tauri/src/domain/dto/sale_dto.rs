// domain/dto/sale_dto.rs
use chrono::NaiveDateTime;

#[derive(Debug, Clone)]
pub struct SaleDTO {
    pub id: u64,
    pub subtotal: f64,
    pub discount_total: f64,
    pub total: f64,
    pub payment_method: String,
    pub created_at: NaiveDateTime,
}
