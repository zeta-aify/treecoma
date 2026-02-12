import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name_en: string;
  name_th: string;
  price: number;
  quantity: number;
  variant?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string, variant?: string) => void;
  updateQuantity: (id: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

function itemKey(id: string, variant?: string) {
  return variant ? `${id}:${variant}` : id;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const key = itemKey(item.id, item.variant);
          const existing = state.items.find(
            (i) => itemKey(i.id, i.variant) === key,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.id, i.variant) === key
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },

      removeItem: (id, variant) => {
        const key = itemKey(id, variant);
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.id, i.variant) !== key,
          ),
        }));
      },

      updateQuantity: (id, quantity, variant) => {
        const key = itemKey(id, variant);
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter(
              (i) => itemKey(i.id, i.variant) !== key,
            ),
          }));
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.id, i.variant) === key ? { ...i, quantity } : i,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
    }),
    {
      name: "ban-passarelli-cart",
    },
  ),
);
