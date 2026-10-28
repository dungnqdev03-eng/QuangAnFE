/* eslint-disable @typescript-eslint/no-explicit-any */

// Đảm bảo luôn có mảng, dù data là mảng hay {content:[...]} (Spring Page)
export function toList(res: any): any[] {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.content)) return res.content;
  return [];
}

// Nếu backend trả đường dẫn ảnh tương đối (vd "/uploads/a.jpg"), điền địa chỉ server vào đây
const FILE_HOST = "";
const placeholder = (t: string) =>
  `https://placehold.co/600x450/e8eef6/0b2545?text=${encodeURIComponent(t || "No image")}`;

export function toProduct(raw: any): Product {
  const specs: Record<string, string> = {};
  if (raw.brand) specs["Thương hiệu"] = String(raw.brand);
  if (raw.origin) specs["Xuất xứ"] = String(raw.origin);
  if (raw.quantity != null) specs["Số lượng"] = String(raw.quantity);

  return {
    id: Number(raw.productId),
    name: raw.productName ?? "",
    price: Number(raw.price ?? 0),
    image: placeholder(raw.productName), // ảnh tạm, ảnh thật được gắn ở product.ts
    categoryId: Number(raw.categoryId ?? 0),
    description: raw.description ?? "",
    specs: Object.keys(specs).length ? specs : undefined,
  };
}

export function toCategory(raw: any): Category {
  return {
    id: Number(raw.productCategoryId),
    name: raw.productCategoryName ?? "",
    icon: "📦",
  };
}

// Lấy đường dẫn ảnh từ 1 phần tử của API ảnh
export function toImageUrl(raw: any): string {
  if (typeof raw === "string") return raw;
  return raw?.imagePath ?? "";
}

// Đổi http sang https (tránh bị chặn khi web chạy https), thêm địa chỉ server nếu là đường dẫn tương đối
export const fullUrl = (u: string) =>
  u.startsWith("http") ? u.replace(/^http:\/\//, "https://") : FILE_HOST + u;