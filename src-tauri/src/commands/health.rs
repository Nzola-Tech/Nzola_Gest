use tauri::State;
use crate::app_state::AppState;

#[tauri::command]
pub fn health_check(state: State<AppState>) -> String {
    format!("Nzola Gest backend ativo 🚀 | DB conectado")
}
