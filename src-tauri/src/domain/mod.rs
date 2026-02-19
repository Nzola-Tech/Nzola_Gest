// This module contains the core domain logic of the application, including entities, value objects, and business rules.

pub mod product;
pub mod sale;
pub mod sale_item;
pub mod user;
pub mod company;
pub mod company_partner;
pub mod fiscal_profile;
pub mod dto;
pub mod repositories;
pub mod domain_error;

pub use sale_item::SaleItem;
pub use domain_error::DomainError;
pub use fiscal_profile::FiscalProfile;
pub use company_partner::CompanyPartner;