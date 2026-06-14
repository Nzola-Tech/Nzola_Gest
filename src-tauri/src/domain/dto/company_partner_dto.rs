// domain/dto/company_partner_dto.rs
#[derive(Debug, Clone)]
pub struct CompanyPartnerDTO {
    pub id: u64,
    pub company_id: u64,
    pub name: String,
    pub document_code: String,
    pub quota_percentage: f64,
}
