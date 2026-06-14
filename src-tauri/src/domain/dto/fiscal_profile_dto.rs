// domain/dto/fiscal_profile_dto.rs
use chrono::NaiveDateTime;

#[derive(Debug, Clone)]
pub struct FiscalProfileDTO {
    pub id: u64,
    pub fiscal_regime: String,
    pub requires_saft: bool,
    pub requires_vat: bool,
    pub created_at: NaiveDateTime,
}
