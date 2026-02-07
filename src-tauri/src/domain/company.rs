// domain/company.rs
use crate::domain::{FiscalProfile, CompanyPartner};

#[derive(Debug)]
pub struct Company {
    pub id: Option<u64>,
    pub name: String,
    pub email: String,
    pub nif: String,
    pub phone: String,
    pub company_type: String,
    pub fiscal_profile: FiscalProfile,
    pub partners: Vec<CompanyPartner>,
}
