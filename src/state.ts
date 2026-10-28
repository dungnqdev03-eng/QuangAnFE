import { useSyncExternalStore } from "react";
// Store giỏ hàng đơn giản, lưu localStorage.
let cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
const subs = new Set<() => void>();
const set = (c: CartItem[]) => { cart = c; localStorage.setItem("cart", JSON.stringify(c)); subs.forEach((f) => f()); };

export const cartActions = {
  add(product: Product, qty = 1) {
    const f = cart.find((i) => i.product.id === product.id);
    set(f ? cart.map((i) => (i === f ? { ...i, qty: i.qty + qty } : i)) : [...cart, { product, qty }]);
  },
  setQty: (id: number, qty: number) => set(cart.map((i) => (i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i))),
  remove: (id: number) => set(cart.filter((i) => i.product.id !== id)),
  clear: () => set([]),
};
export const useCart = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => cart);
