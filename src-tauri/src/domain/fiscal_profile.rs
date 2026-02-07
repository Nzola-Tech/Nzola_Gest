// domain/fiscal_profile.rs
#[derive(Debug, Clone)]
pub struct FiscalProfile {
    pub fiscal_regime: String,
    pub requires_saft: bool,
    pub requires_vat: bool,
}
