// domain/user.rs
#[derive(Debug, Clone)]
pub struct User {
    pub id: u64,
    pub username: String,
    pub name: String,
    pub surname: String,
    pub role: String,
    pub status: String,
}
