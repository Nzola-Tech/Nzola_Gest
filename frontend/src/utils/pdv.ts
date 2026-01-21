import { CartItem } from "@/types/pdv";

export const calculateItemTotal = (item: CartItem) => {
  const baseTotal = item.sale_price * item.quantity;
  const discount = calculateDiscountValue(item);

  return Math.max(0, baseTotal - discount);
};

export const calculateDiscountValue = (item: CartItem) => {
  const baseTotal = item.sale_price * item.quantity;

  if (!item.discount_type) return 0;
  if (item.discount_value == null) return 0;

  if (item.discount_type === "FIXED") {
    return Math.min(item.discount_value, baseTotal);
  }

  if (item.discount_type === "PERCENTAGE") {
    return baseTotal * (item.discount_value / 100);
  }

  return 0;
};
