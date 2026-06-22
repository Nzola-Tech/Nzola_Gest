import { create } from "zustand";
import { Selection } from "@heroui/table";

import { CartItem, paymentOptions } from "@/types/pdv";
import { DiscountType } from "@/components/pdv/EditProductDiscountModal";

interface PdvState {
  cart: CartItem[];
  payment: Selection;
  selectedKeys: Selection;
  addToCart: (product: CartItem) => void;
  changePayment: (option: Selection) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  applyDiscount: (
    id: number,
    type: DiscountType,
    value: number
  ) => void;
  setSelectedKeys: (keys: Selection) => void;
  setCart: (cart: CartItem[]) => void;
}

export const usePdvStore = create<PdvState>((set) => ({
  cart: [],
  payment: new Set([paymentOptions[0].value]),
  selectedKeys: new Set([]),

  addToCart: (product) =>
    set((state) => {
      const exists = state.cart.find((item) => item.id === product.id);

      if (exists) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }

      return {
        cart: [...state.cart, { ...product, quantity: 1 }],
      };
    }),

  removeFromCart: (id) =>
    set((state) => {
      const newKeys = new Set(state.selectedKeys);

      newKeys.delete(String(id));

      return {
        cart: state.cart.filter((item) => item.id !== id),
        selectedKeys: newKeys,
      };
    }),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    })),

  applyDiscount: (id, type, value) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id
          ? {
            ...item,
            discount_type: value > 0 ? type : null,
            discount_value: value > 0 ? value : 0,
          }
          : item,
      ),
    })),

  changePayment: (option) => set({ payment: option }),

  setSelectedKeys: (keys) => set({ selectedKeys: keys }),

  setCart: (cart) => set({ cart }),
}));
