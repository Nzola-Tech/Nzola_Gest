import { DiscountType } from "@/components/pdv/EditProductDiscountModal";
import { Product } from "../products";

export type PdvProps = {
  products: Product[];
  db: any;
  onSaleComplete?: () => void;
};

export type CartItem = {
  id: number;
  name: string;
  sale_price: number;
  quantity: number;
  unit_price?: number;
  discount_type?: DiscountType | null;
  discount_value?: number;
  discount_amount?: number;
  subtotal?: number;
  total?: number;
};

export const paymentOptions = [
  { key: "dinheiro", value: "Dinheiro" },
  { key: "cartão", value: "Cartão" },
  { key: "crédito", value: "Crédito" },
];

export interface SellFormProps {
  onEditQuantity: (productId: number, quantity: number) => void;
  onEditDiscount: (productId: number) => void;
  confirmPrint?: () => void;
}

export type Sale = {
  id: number;
  total: number;
  payment_method: string;
  created_at: string;
  subtotal?: number;
  discount_total?: number;
};

export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  product_name: string; // vindo do JOIN com products
  quantity: number;
  price: number;
  created_at: string;
  unit_price?: number;
  discount_type?: string | null;
  discount_value?: number;
  discount_amount?: number;
  subtotal?: number | null;
  total?: number | null;
}
