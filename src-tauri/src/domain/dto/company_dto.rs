// domain/dto/company_dto.rs
use chrono::NaiveDateTime;

#[derive(Debug, Clone)]
pub struct CompanyDTO {
    pub id: u64,
    pub name: String,
    pub email: String,
    pub nif: String,
    pub phone: String,
    pub website: Option<String>,
    pub trade_register: Option<String>,
    pub company_type: String,
    pub fiscal_profile_id: u64,
    pub province: Option<String>,
    pub municipality: Option<String>,
    pub street: Option<String>,
    pub neighborhood: Option<String>,
    pub building: Option<String>,
    pub logo: Option<String>,
    pub created_at: NaiveDateTime,
}
