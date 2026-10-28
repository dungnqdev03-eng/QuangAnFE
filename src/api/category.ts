import { request } from "./apiClient";
import { toList, toCategory } from "./mapper";

// GET /product/category
// Chỉ hiện danh mục đang hoạt động (status khác false)
export async function getCategories(): Promise<Category[]> {
  const list = toList(await request<unknown>("/product/category"));
  return list
    .filter((c: { status?: boolean }) => c.status !== false)
    .map(toCategory);
}

// POST /product/create_category (trang quản trị, chưa dùng trong giao diện)
export async function createCategory(data: { productCategoryName: string; status?: boolean }) {
  return request("/product/create_category", { method: "POST", body: JSON.stringify(data) });
}
