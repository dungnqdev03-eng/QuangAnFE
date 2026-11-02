import { useSyncExternalStore } from "react";

// Giỏ hàng: cộng dồn số lượng khi thêm lại cùng sản phẩm, tự lưu và nạp từ localStorage
const KEY = "quangan.cart.v1";
const MAX_QTY = 999;

// Chỉ lưu các trường cần thiết để giỏ gọn, không phình localStorage
const slim = (p: Product): Product => ({
  id: p.id, name: p.name, price: p.price, image: p.image, categoryId: p.categoryId, description: "",
});

function load(): CartItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((i) => i?.product && Number.isFinite(Number(i.product.id)) && Number(i.qty) > 0)
      .map((i) => ({
        product: { ...i.product, id: Number(i.product.id), price: Number(i.product.price) || 0 },
        qty: Math.min(MAX_QTY, Math.floor(Number(i.qty))),
      }));
  } catch {
    return [];
  }
}

let cart: CartItem[] = load();
const subs = new Set<() => void>();
const notify = () => subs.forEach((f) => f());

function commit(next: CartItem[]) {
  cart = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch (e) {
    console.warn("Không lưu được giỏ hàng vào localStorage", e);
  }
  notify();
}

// Mở nhiều tab: giỏ hàng tự đồng bộ giữa các tab
window.addEventListener("storage", (e) => {
  if (e.key === KEY) { cart = load(); notify(); }
});

export const cartActions = {
  add(product: Product, qty = 1) {
    const id = Number(product.id);
    if (!Number.isFinite(id)) {
      console.error("Sản phẩm thiếu id nên không thêm được vào giỏ", product);
      return;
    }
    const exists = cart.some((i) => i.product.id === id);
    commit(
      exists
        ? cart.map((i) => (i.product.id === id ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i))
        : [...cart, { product: slim({ ...product, id }), qty: Math.min(MAX_QTY, qty) }]
    );
  },
  setQty(id: number, qty: number) {
    const q = Math.min(MAX_QTY, Math.max(1, Math.floor(qty) || 1));
    commit(cart.map((i) => (i.product.id === id ? { ...i, qty: q } : i)));
  },
  remove(id: number) {
    commit(cart.filter((i) => i.product.id !== id));
  },
  clear() {
    commit([]);
  },
};

const subscribe = (f: () => void) => {
  subs.add(f);
  return () => { subs.delete(f); };
};

export const useCart = () => useSyncExternalStore(subscribe, () => cart);