import { Card, CardHeader, CardBody } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BanknotesIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

import DefaultLayout from "@/layouts/default";
import { useDbStore } from "@/store/db-store";
import {
  getMonthlySales,
  /* getExpenses, */
  getTopProductsThisMonth,
  /* Expense, */
} from "@/services/financas/financas";

export default function Financas() {
  const { db } = useDbStore();
  const [monthlySales, setMonthlySales] = useState<
    { mes: string; total: number }[]
  >([]);
  //const [expenses, setExpenses] = useState<Expense[]>([]);
  const [topProducts, setTopProducts] = useState<
    { product_name: string; total_quantity: number }[]
  >([]);

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!db) return;
      const vendas = await getMonthlySales(db);

      // Mapeia vendas por índice do mês
      const vendasMap = vendas.reduce(
        (acc, v) => {
          const mesIndex = parseInt(v.mes, 10) - 1; // "01" -> 0

          acc[mesIndex] = v.total;

          return acc;
        },
        {} as Record<number, number>,
      );

      // Últimos 6 meses
      const currentMonth = new Date().getMonth(); // 0-11
      const ultimos6Meses: { mes: string; total: number }[] = [];

      for (let i = 5; i >= 0; i--) {
        const mesIndex = (currentMonth - i + 12) % 12;

        ultimos6Meses.push({
          mes: monthNames[mesIndex],
          total: vendasMap[mesIndex] || 0,
        });
      }

      setMonthlySales(ultimos6Meses);

      /* try {
        const despesas = await getExpenses(db);

        setExpenses(despesas);
      } catch {
        // fallback se não existir tabela de despesas
        setExpenses([
          { tipo: "Aluguel", valor: 500 },
          { tipo: "Energia", valor: 200 },
        ]);
      } */

      const produtos = await getTopProductsThisMonth(db);
      // ordenar produtos por quantidade
      const produtosOrdenados = [...produtos].sort(
        (a, b) => b.total_quantity - a.total_quantity,
      );

      setTopProducts(produtosOrdenados);
    };

    fetchData();
  }, [db]);

  // Calcular totais
  const totalVendas = monthlySales.reduce((acc, v) => acc + (v.total || 0), 0);

  // Formatador de moeda
  const formatKz = (valor: number) =>
    new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(valor);

  return (
    <DefaultLayout>
      <div className="py-6 space-y-8">
        {/* Cards Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardBody className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Vendas</p>
                <h2 className="text-xl font-bold">{formatKz(totalVendas)}</h2>
              </div>
              <ArrowTrendingUpIcon className="text-green-500 size-6" />
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Mês Atual</p>
                <h2 className="text-xl font-bold">
                  {new Date().toLocaleString("pt-BR", { month: "long" })}
                </h2>
              </div>
              <BanknotesIcon className="text-blue-500 size-6" />
            </CardBody>
          </Card>
        </div>

        {/* Abas */}
        <Tabs aria-label="Finance Tabs" variant="bordered">
          <Tab key="vendas" title="📈 Vendas">
            <Card>
              <CardHeader>Gráfico de Vendas (Últimos 6 Meses)</CardHeader>
              <CardBody>
                <ResponsiveContainer height={300} width="100%">
                  <LineChart data={monthlySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      connectNulls
                      dataKey="total"
                      name="Faturamento"
                      stroke="#3b82f6"
                      type="monotone"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="produtos" title="📊 Top Produtos">
            <Card>
              <CardHeader>Top Produtos Vendidos do Mês</CardHeader>
              <CardBody>
                <ResponsiveContainer height={300} width="100%">
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="total_quantity"
                      fill="#10b981"
                      name="Qtd Vendida"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </DefaultLayout>
  );
}
