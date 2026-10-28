interface Category { id: number; name: string; icon: string }
interface Product {
  id: number; name: string; price: number; image: string; categoryId: number;
  description: string; specs?: Record<string, string>;
  images?: string[];
}
interface CartItem { product: Product; qty: number }
interface QuotePayload { name: string; phone: string; note?: string; items: { productId: number; qty: number }[] }
interface QuotePayload {
  name: string; phone: string; note?: string;
  email?: string; address?: string; payment?: string;
  items: { productId: number; qty: number }[];
}
type PaymentMethod = "CASH" | "ELECTRONIC_PAYMENT";

interface OrderPayload {
  gender: boolean;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  note: string;
  productName: string;
  productId: number;
  quantity: number;
  unitPrice: number;
  paymentMethod: PaymentMethod;
}