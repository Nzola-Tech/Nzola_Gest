use std::fmt;

#[derive(Debug)]
pub enum DomainError {
    Invalid(&'static str),
}

impl fmt::Display for DomainError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            DomainError::Invalid(msg) => write!(f, "{}", msg),
        }
    }
}

impl std::error::Error for DomainError {}
