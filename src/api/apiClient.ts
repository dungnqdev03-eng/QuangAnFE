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
  if (!res.ok) throw new Error(`API lỗi ${res.status} (${path})`);
  if (res.status === 204) return undefined as T;

  const body = await res.json();
  // Backend trả { code, message, data } => chỉ lấy data
  return (body && typeof body === "object" && "data" in body ? body.data : body) as T;
}