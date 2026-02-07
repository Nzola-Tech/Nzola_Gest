// domain/dto/sale_item_dto.rs
use chrono::NaiveDateTime;

#[derive(Debug, Clone)]
pub struct SaleItemDTO {
    pub id: u64,
    pub sale_id: u64,
    pub product_id: u64,
    pub quantity: i32,
    pub unit_price: f64,
    pub discount_type: Option<String>,
    pub discount_value: f64,
    pub discount_amount: f64,
    pub subtotal: f64,
    pub total: f64,
    pub created_at: NaiveDateTime,
}
