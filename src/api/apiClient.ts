// Điểm gọi API duy nhất. Thêm token/interceptor ở đây.
export const BASE_URL = "/api/v1";

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const res = await fetch(BASE_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Đọc dạng chữ trước: backend có thể trả JSON hoặc chữ thường (ví dụ "success")
  const text = await res.text();
  let body: any = text;
  if (text) {
    try { body = JSON.parse(text); } catch { body = text; }
  }

  if (!res.ok) {
    const msg = typeof body === "string" ? body : body?.message; // lấy câu báo lỗi của backend
    throw new Error(msg || `API lỗi ${res.status}`);
  }

  // Backend trả { code, message, data } thì chỉ lấy data
  if (body && typeof body === "object" && "data" in body) return body.data as T;
  return body as T;
}