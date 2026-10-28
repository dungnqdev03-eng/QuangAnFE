import { request } from "./apiClient";
import { toList, toProduct, toImageUrl, fullUrl } from "./mapper";

// GET /product/all_images_statusTrue/{productId}: lấy tất cả ảnh đang bật của 1 sản phẩm
const imgCache = new Map<number, string[]>();

async function getImages(productId: number): Promise<string[]> {
  if (imgCache.has(productId)) return imgCache.get(productId)!;
  try {
    const res = await request<unknown>(`/product/all_images_statusTrue/${productId}`);
    const urls = toList(res).map(toImageUrl).filter(Boolean).map(fullUrl);
    imgCache.set(productId, urls);
    return urls;
  } catch (e) {
    console.warn("Không lấy được ảnh của sản phẩm", productId, e);
    return [];
  }
}

// Gắn ảnh thật vào danh sách sản phẩm
async function withImages(list: Product[]): Promise<Product[]> {
  return Promise.all(
    list.map(async (p) => {
      const urls = await getImages(p.id);
      return urls.length ? { ...p, image: urls[0], images: urls } : p;
    })
  );
}

// GET /product/all  hoặc  GET /product/category/{cId}
export async function getProducts(p: { categoryId?: number; q?: string } = {}): Promise<Product[]> {
  const path = p.categoryId ? `/product/category/${p.categoryId}` : "/product/all";
  let list = toList(await request<unknown>(path)).map(toProduct);
  if (p.categoryId) list = list.map((x) => ({ ...x, categoryId: x.categoryId || p.categoryId! }));
  const q = p.q?.trim().toLowerCase();
  if (q) list = list.filter((x) => x.name.toLowerCase().includes(q));
  return withImages(list);
}

// Backend chưa có GET /product/{id} nên lấy tất cả rồi tìm
export async function getProduct(id: number): Promise<Product | undefined> {
  const found = toList(await request<unknown>("/product/all")).map(toProduct).find((x) => x.id === id);
  if (!found) return undefined;
  return (await withImages([found]))[0];
}

// GET /product/status/{status}
export async function getProductsByStatus(status: string): Promise<Product[]> {
  return withImages(toList(await request<unknown>(`/product/status/${encodeURIComponent(status)}`)).map(toProduct));
}

// POST /product/create (trang quản trị, chưa dùng trong giao diện)
export async function createProduct(data: Partial<Product>) {
  return request("/product/create", { method: "POST", body: JSON.stringify(data) });
}

// Backend chưa có API báo giá nên tạm in ra console.
export async function submitQuote(data: QuotePayload): Promise<{ ok: boolean }> {
  console.log("QUOTE", data);
  return { ok: true };
}

// PUT /product/update/{id}: backend cần có API này. Đổi đường dẫn, tên trường cho khớp với backend
export async function updateProductDescription(id: number, description: string) {
  return request(`/product/update/${id}`, { method: "PUT", body: JSON.stringify({ description }) });
}