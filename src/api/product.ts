import { request } from "./apiClient";
import { getCategories } from "./category";
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

// Nhớ các sản phẩm đã tải để mở trang chi tiết ngay, không phụ thuộc API nào
const productCache = new Map<number, Product>();
const remember = (list: Product[]) => { list.forEach((p) => productCache.set(p.id, p)); return list; };

// GET /product/all  hoặc  GET /product/category/{cId}
export async function getProducts(p: { categoryId?: number; q?: string } = {}): Promise<Product[]> {
  const path = p.categoryId ? `/product/category/${p.categoryId}` : "/product/all";
  let list = toList(await request<unknown>(path)).map(toProduct);
  if (p.categoryId) list = list.map((x) => ({ ...x, categoryId: x.categoryId || p.categoryId! }));
  const q = p.q?.trim().toLowerCase();
  if (q) list = list.filter((x) => x.name.toLowerCase().includes(q));
  return remember(await withImages(list));
}

// Chi tiết 1 sản phẩm: tìm trong bộ nhớ, rồi /all, rồi từng danh mục (backend chưa có GET /product/{id})
export async function getProduct(id: number): Promise<Product | undefined> {
  const cached = productCache.get(id);
  if (cached) return cached;

  const find = async (path: string) =>
    toList(await request<unknown>(path)).map(toProduct).find((x) => x.id === id);

  let found = await find("/product/all");
  if (!found) {
    for (const c of await getCategories()) {
      found = await find(`/product/category/${c.id}`);
      if (found) { found = { ...found, categoryId: found.categoryId || c.id }; break; }
    }
  }
  if (!found) return undefined;
  const [withImg] = await withImages([found]);
  productCache.set(id, withImg);
  return withImg;
}

// GET /product/status/{status}
export async function getProductsByStatus(status: string): Promise<Product[]> {
  return remember(await withImages(toList(await request<unknown>(`/product/status/${encodeURIComponent(status)}`)).map(toProduct)));
}

// POST /product/create (trang quản trị, chưa dùng trong giao diện)
export async function createProduct(data: Partial<Product>) {
  return request("/product/create", { method: "POST", body: JSON.stringify(data) });
}

// POST /product/order: đặt hàng nhanh một sản phẩm
export async function createOrder(data: OrderPayload) {
  return request("/product/order", { method: "POST", body: JSON.stringify(data) });
}

// Cập nhật mô tả (backend cần có API này), dùng cho trang Admin sau này
export async function updateProductDescription(id: number, description: string) {
  return request(`/product/update/${id}`, { method: "PUT", body: JSON.stringify({ description }) });
}

// Trang Báo giá (giỏ hàng nhiều sản phẩm): backend chưa có API nên tạm in ra console
export async function submitQuote(data: QuotePayload): Promise<{ ok: boolean }> {
  console.log("QUOTE", data);
  return { ok: true };
}