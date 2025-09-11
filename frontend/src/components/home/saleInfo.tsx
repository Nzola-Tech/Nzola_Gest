import {
  BanknotesIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  ShieldExclamationIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

import { useDbStore } from "@/store/db-store";

export default function SaleInfo({
  soldToday,
  totalSalesToday,
}: {
  soldToday: number;
  totalSalesToday: number;
}) {
  const { products } = useDbStore();
  const allProducts = products.filter(
    (product) =>
      product.deleted === 0 &&
      product.stock_quantity > 0 &&
      product.expiration_date !== new Date().toISOString().split("T")[0],
  );
  const unavailableProducts = products.filter(
    (product) =>
      product.deleted === 1 ||
      product.stock_quantity === 0 ||
      product.expiration_date === new Date().toISOString().split("T")[0],
  );

  return (
    <div className="w-full grid grid-rows-1 grid-cols-4 gap-4 py-4">
      <div className="group flex items-center gap-4 p-2 bg-white dark:bg-default-100 rounded-lg shadow-md hover:bg-success-500 dark:hover:bg-success-500 transition-colors">
        <BanknotesIcon className="size-16 text-success-500 group-hover:text-white" />
        <div>
          <h3 className="text-lg font-semibold group-hover:text-white">
            Vendas
          </h3>
          <div className="flex items-center gap-x-2 group-hover:text-white">
            <CalendarDaysIcon className="size-5" />
            <span>
              Hoje,{" "}
              {(() => {
                const data = new Date().toLocaleDateString("pt-BR").split("/");

                return `${data[0]} ${data[2]}`;
              })()}
            </span>
          </div>
          <p className="text-2xl font-bold text-success-500 group-hover:text-white">
            {totalSalesToday} KZ
          </p>
        </div>
      </div>

      <div className="group flex items-center gap-4 p-4 bg-white dark:bg-default-100 rounded-lg shadow-md hover:bg-success-500 dark:hover:bg-success-500 transition-colors">
        <ShoppingBagIcon className="size-16 text-success-500 group-hover:text-white" />
        <div>
          <h3 className="text-lg font-semibold group-hover:text-white">
            Produtos Vendidos
          </h3>
          <div className="flex items-center gap-x-2 group-hover:text-white">
            <CalendarDaysIcon className="size-5" />
            <span>
              Hoje,{" "}
              {(() => {
                const data = new Date().toLocaleDateString("pt-BR").split("/");

                return `${data[0]} ${data[2]}`;
              })()}
            </span>
          </div>
          <p className="text-2xl font-bold text-success-500 group-hover:text-white">
            {soldToday}
          </p>
        </div>
      </div>

      <div className="group flex items-center gap-4 p-4 bg-white dark:bg-default-100 rounded-lg shadow-md hover:bg-success-500 dark:hover:bg-success-500 transition-colors">
        <ShoppingCartIcon className="size-16 text-success-500 group-hover:text-white" />
        <div>
          <h3 className="text-lg font-semibold group-hover:text-white">
            Produtos em estoque
          </h3>
          <div className="flex items-center gap-x-2 group-hover:text-white">
            <CalendarDaysIcon className="size-5" />
            <span>
              Hoje,{" "}
              {(() => {
                const data = new Date().toLocaleDateString("pt-BR").split("/");

                return `${data[0]} ${data[2]}`;
              })()}
            </span>
          </div>
          <p className="text-2xl font-bold text-success-500 group-hover:text-white">
            {allProducts.length}
          </p>
        </div>
      </div>

      <div className="group flex items-center gap-4 p-4 bg-white dark:bg-default-100 rounded-lg shadow-md hover:bg-warning-500 dark:hover:bg-warning-500 transition-colors">
        <ShieldExclamationIcon className="size-16 text-warning-500 group-hover:text-white" />
        <div>
          <h3 className="text-lg font-semibold group-hover:text-white">
            Produtos fora de estoque
          </h3>
          <div className="flex items-center gap-x-2 group-hover:text-white">
            <CalendarDaysIcon className="size-5" />
            <span>
              Hoje,{" "}
              {(() => {
                const data = new Date().toLocaleDateString("pt-BR").split("/");

                return `${data[0]} ${data[2]}`;
              })()}
            </span>
          </div>
          <p className="text-2xl font-bold text-warning-500 group-hover:text-white">
            {unavailableProducts.length}
          </p>
        </div>
      </div>
    </div>
  );
}
