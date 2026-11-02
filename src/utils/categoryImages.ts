import { mockCatImage } from "./mockImage";

// ===== DÁN LINK ẢNH VÀO ĐÂY =====
// Bên trái: tên danh mục (không phân biệt hoa thường và dấu) hoặc id danh mục dạng chữ, ví dụ "1".
// Bên phải: link ảnh nằm giữa hai dấu ngoặc kép. Để trống "" thì dùng ảnh minh họa vẽ sẵn.
const IMAGES: Record<string, string> = {
  "Trụ Đèn": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQIB_9-mOLs2E1eEYzwJTBObc9yPyqDpcbjD-v6CduMg&s=10",
  "Đèn Năng Lượng Mặt Trời": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZboJRjZE-tL3H1eoK3k_1XpahKhWKLtHXn1VmBHie7w&s=10",
  "BuLong Móng": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu3u1iTjvp5dML97OUt03nM-yFxqHK_RFtzt-fFlYHuA&s=10",
  "Cần Đèn Kiểu": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3wLXa_zUcuyKqnChlat-s_2FcPsPPCF2gEiZ7fJvUdA&s=10",
  "Hộ Lan": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlJaxGpVTssB5BvL0iN4qKZyKrLxpFILaNE70k4h1myA&s=10",
  "Lan Can": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRwI6P4yfvFFoGt_an_06FWga7REy88DMGuzrAHnEp-A&s=10",
  // Thêm danh mục mới: "Tên danh mục": "https://...",
};

const norm = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim();

const byName = new Map(Object.entries(IMAGES).map(([k, v]) => [norm(k), v]));

export function categoryImage(c: Category): string {
  const url = IMAGES[String(c.id)] || byName.get(norm(c.name));
  return url?.trim() || mockCatImage(c.name);
}