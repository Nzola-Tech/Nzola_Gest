import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { useDbStore } from "@/store/db-store";
import {
  getTop10ProductsByDay,
  DailyProductSales,
} from "@/services/pdv/charts";

export default function DailyTopProductsChart() {
  const { db } = useDbStore();
  const [data, setData] = useState<DailyProductSales[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!db) return;
      const result = await getTop10ProductsByDay(db);

      setData(result);
    };

    fetchData();
  }, [db]);

  return (
    <div className="w-full h-[200px] p-4 bg-white dark:bg-default-100 ">
      <h2 className="text-lg font-bold mb-4">
        Top 10 Produtos Mais Vendidos (Diário)
      </h2>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[180px] text-gray-500 dark:text-gray-400 text-center px-4">
          <p>
            Ainda não houve vendas hoje.
            <br />
            Desejamos boas vendas para o seu dia! 🚀
          </p>
        </div>
      ) : (
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product_name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="total_quantity"
              fill="#3b82f6"
              name="Quantidade Vendida"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
