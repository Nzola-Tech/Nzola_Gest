// File src-tauri/src/application/sale_service.rs
use crate::application::dto::create_sale_dto::CreateSaleDTO;
use crate::domain::repositories::sale_repository::SaleRepository;


pub struct SaleService<R: SaleRepository> {
    repository: R,
}

impl<R: SaleRepository> SaleService<R> {
    pub fn new(repository: R) -> Self {
        Self { repository }
    }

    pub async fn create_sale(&self, dto: CreateSaleDTO) -> Result<(), String> {
        // Aqui você pode adicionar validações e lógica de negócio antes de criar a venda
        let mut sale = crate::domain::Sale::create(dto.customer_id)
            .map_err(|e| format!("{:?}", e))?;

        let items = dto.items.into_iter().map(|item| {
            crate::domain::SaleItem::create(item.product_id, item.quantity, item.price)
                .map_err(|e| format!("{:?}", e))
        }).collect::<Result<Vec<_>, _>>()?;

        self.repository.create(&mut sale, items).await
    }
}