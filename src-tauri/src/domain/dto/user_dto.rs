// domain/dto/user_dto.rs
use chrono::NaiveDateTime;

#[derive(Debug, Clone)]
pub struct UserDTO {
    pub id: u64,
    pub username: String,
    pub name: String,
    pub surname: String,
    pub email: String,
    pub role: String,
    pub status: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}
