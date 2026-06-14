use tauri::State;
use crate::app_state::AppState;

#[tauri::command]
pub async fn health_check(state: State<'_, AppState>) -> Result<String, String> {
    let result = sqlx::query_scalar::<_, i64>("SELECT 1")
        .fetch_one(&state.db)
        .await;

    match result {
        Ok(_) => Ok("Nzola Gest backend ativo 🚀 | DB conectado ✅".to_string()),
        Err(e) => Err(format!("DB erro ❌: {}", e)),
    }
}
