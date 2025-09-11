import {
  ShoppingCartIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ButtonGroup, Button } from "@heroui/button";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Select, SelectItem } from "@heroui/select";
import { useEffect, useState } from "react";
import { Form } from "@heroui/form";
import { NumberInput } from "@heroui/number-input";

import { Product } from "./product";

import { paymentOptions, SellFormProps } from "@/types/pdv";
import { useDbStore } from "@/store/db-store";
import { usePdvStore } from "@/store/pdv-store";
import { insertSale, insertSaleItemsAndUpdateStock } from "@/database";

export const SellForm = ({ onEditQuantity }: SellFormProps) => {
  const { db, refreshProducts } = useDbStore();
  const { cart, setCart, setSelectedKeys, payment, changePayment } =
    usePdvStore();
  const [totalPayment, setTotalPayment] = useState(0);
  const [paymentError, setPaymentError] = useState(false);
  const total = cart.reduce(
    (sum, item) => sum + item.sale_price * item.quantity,
    0,
  );
  const troco =
    totalPayment >= total
      ? Math.max(0, totalPayment - total).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0,00";

  useEffect(() => {
    setTotalPayment(
      cart.reduce((sum, item) => sum + item.sale_price * item.quantity, 0),
    );
  }, [cart]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db || cart.length === 0) return;
    if (totalPayment === 0 || totalPayment < total) {
      setPaymentError(true);

      return;
    }
    const selectedPayment = [...payment][0].toString();
    const now = new Date().toISOString();
    //const pdfUrl = generatePDF(cart, total, selectedPayment, "00001", {
    //  name: "Cliente Teste",
    //  nif: "123456789",
    //});
    //window.open(pdfUrl, "_blank");

    const saleId = await insertSale(db, total, selectedPayment.toString(), now);

    await insertSaleItemsAndUpdateStock(db, saleId, cart, now);

    setCart([]);
    setSelectedKeys(new Set([]));
    changePayment(new Set([]));
    refreshProducts && refreshProducts();
  };

  return (
    <Form className="overflow-auto col-span-4" onSubmit={handleSubmit}>
      <div className="w-full grid grid-row-8 h-full">
        <div className="relative bg-slate-100 dark:bg-zinc-800 dark:text-white p-4 rounded-t-3xl">
          <div>
            <h1 className="font-bold text-lg">Nzola Gest Farmacia</h1>
            <p>Factura</p>
          </div>
          <div className="flex justify-between items-center">
            <p>Total a pagar</p>
            <h2 className="text-right text-3xl font-semibold text-green-400">
              {total.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              KZ
            </h2>
          </div>
          <div className="flex justify-between items-center">
            <p>Troco</p>
            <h2 className="text-right text-lg font-semibold text-green-400">
              {troco}KZ
            </h2>
          </div>
        </div>

        <ScrollShadow className="row-span-6 p-4 space-y-4 h-full text-center">
          <div className="grid grid-cols-5 gap-2 mb-2">
            <span className="font-semibold">Nome</span>
            <span className="font-semibold">Qt</span>
            <span className="font-semibold">Preço</span>
            <span className="font-semibold">Desconto</span>
            <span className="font-semibold">Ações</span>

            {cart.length === 0 ? (
              <div className="col-span-5 flex justify-center items-center gap-4 py-4">
                <p>Sem itens adicionados ao carrinho.</p>
                <ShoppingCartIcon className="size-6" />
              </div>
            ) : (
              cart.map((item) => (
                <Product
                  key={item.id}
                  item={item}
                  onEditQuantity={onEditQuantity}
                />
              ))
            )}
          </div>
        </ScrollShadow>

        <div className="flex flex-col items-end justify-end gap-2 bg-slate-100 p-4 dark:bg-zinc-800">
          <NumberInput
            hideStepper
            isRequired
            errorMessage={
              paymentError
                ? `Pagamento inválido total a pagar ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz`
                : undefined
            }
            formatOptions={{
              style: "currency",
              currency: "AOA",
            }}
            isInvalid={paymentError}
            label="PAGAMENTO"
            name="totalPayment"
            placeholder="0.00"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">$</span>
              </div>
            }
            value={totalPayment === 0 ? undefined : totalPayment}
            variant="underlined"
            onValueChange={(value) => {
              if (value < 0) {
                setPaymentError(true);
              } else {
                setTotalPayment(value);
                if (value >= total) setPaymentError(false);
              }
            }}
          />
          <Select
            isRequired
            className="w-[217.5px]"
            label="Modo de pagamento"
            name="paymentMode"
            placeholder="Selecione um metodo"
            selectedKeys={payment}
            size="md"
            variant="underlined"
            onSelectionChange={changePayment}
          >
            {paymentOptions.map((pay) => (
              <SelectItem key={pay.value}>{pay.key}</SelectItem>
            ))}
          </Select>
          <ButtonGroup size="md">
            <Button
              className="text-white"
              color="success"
              endContent={<CheckIcon className="size-5" />}
              type="submit"
            >
              Facturar
            </Button>
            <Button
              className="bg-red-600 text-white"
              endContent={<XMarkIcon className="size-5" />}
              type="reset"
              onPress={() => {
                setCart([]);
                setSelectedKeys(new Set([]));
                changePayment(new Set([]));
                refreshProducts && refreshProducts();
              }}
            >
              Cancela
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </Form>
  );
};
