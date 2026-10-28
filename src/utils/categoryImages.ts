import { mockCatImage } from "./mockImage";

// ===== DÁN LINK ẢNH VÀO ĐÂY =====
// Bên trái: tên danh mục (không phân biệt hoa thường và dấu) hoặc id danh mục dạng chữ, ví dụ "1".
// Bên phải: link ảnh nằm giữa hai dấu ngoặc kép. Để trống "" thì dùng ảnh minh họa vẽ sẵn.
const IMAGES: Record<string, string> = {
  "Trụ Đèn": "",
  "Đèn Năng Lượng Mặt Trời": "",
  "BuLong Móng": "",
  "Cần Đèn Kiểu": "",
  "Hộ Can": "",
  "Lan Can": "",
  // Thêm danh mục mới: "Tên danh mục": "https://...",
};

const norm = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim();

const byName = new Map(Object.entries(IMAGES).map(([k, v]) => [norm(k), v]));

export function categoryImage(c: Category): string {
  const url = IMAGES[String(c.id)] || byName.get(norm(c.name));
  return url?.trim() || mockCatImage(c.name);
}