interface Category { id: number; name: string; icon: string }
interface Product {
  id: number; name: string; price: number; image: string; categoryId: number;
  description: string; specs?: Record<string, string>;
  images?: string[];
}
interface CartItem { product: Product; qty: number }
interface QuotePayload { name: string; phone: string; note?: string; items: { productId: number; qty: number }[] }
